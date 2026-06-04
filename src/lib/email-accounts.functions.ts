import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmailAccountSummary = {
  id: string;
  provider: string;
  email: string;
  status: "connected" | "disconnected" | "error" | "reauth_required";
  last_synced_at: string | null;
  created_at: string;
  last_error: string | null;
};

export type LatestSyncJob = {
  status: "queued" | "running" | "success" | "failed";
  started_at: string | null;
  finished_at: string | null;
  processed_count: number;
  imported_count: number;
  error: string | null;
} | null;

export const listEmailAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailAccountSummary[]> => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("email_accounts")
      .select("id, provider, email, status, last_synced_at, created_at, last_error")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as EmailAccountSummary[];
  });

export const disconnectEmailAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("email_accounts")
      .update({
        status: "disconnected" as const,
        access_token_enc: null,
        refresh_token_enc: null,
        token_expires_at: null,
        lovable_connection_id: null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEmailAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("email_accounts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getLatestSyncJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ accountId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<LatestSyncJob> => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("email_sync_jobs")
      .select("status, started_at, finished_at, processed_count, imported_count, error")
      .eq("account_id", data.accountId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);
    return (rows?.[0] as LatestSyncJob) ?? null;
  });

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev";

/** Start Gmail OAuth — returns an authorization URL for the popup. */
export const startGmailConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ targetOrigin: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const clientId = process.env.GOOGLE_APP_USER_CONNECTOR_CLIENT_ID;
    if (!clientId) throw new Error("Gmail integration is not configured.");
    const { authorizeAppUserOAuth } = await import("@/integrations/lovable/appUserConnector");
    const { authorizationUrl } = await authorizeAppUserOAuth({
      gatewayBaseUrl: GATEWAY_BASE_URL,
      connectorId: "google_mail",
      appUserId: userId,
      connectorClientId: clientId,
      returnUrl: `${data.targetOrigin}/settings`,
      responseMode: "web_message",
      webMessageTargetOrigin: data.targetOrigin,
      credentialsConfiguration: {
        scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
      },
    });
    return { authorizationUrl };
  });

/** Persist the connection ID returned by the OAuth popup and fetch the mailbox address. */
export const completeGmailConnect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ connectionId: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callAsAppUser } = await import("@/integrations/lovable/appUserConnector");
    // Resolve the Gmail address for display
    const profileRes = await callAsAppUser({
      gatewayBaseUrl: GATEWAY_BASE_URL,
      connectionId: data.connectionId,
      connectorId: "google_mail",
      path: "/gmail/v1/users/me/profile",
    });
    if (!profileRes.ok) {
      const t = await profileRes.text();
      throw new Error(`Gmail profile lookup failed (${profileRes.status}): ${t.slice(0, 200)}`);
    }
    const profile = (await profileRes.json()) as { emailAddress?: string };
    const email = profile.emailAddress;
    if (!email) throw new Error("Could not read Gmail address.");

    const { error } = await supabase
      .from("email_accounts")
      .upsert(
        {
          user_id: userId,
          provider: "gmail",
          email,
          lovable_connection_id: data.connectionId,
          status: "connected" as const,
          scopes: "gmail.readonly",
          last_error: null,
        },
        { onConflict: "user_id,provider,email" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, email };
  });

/** Real sync: pulls last 90d of financial emails, parses, dedupes, inserts transactions. */
export const triggerEmailSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ accountId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: account, error: acctErr } = await supabase
      .from("email_accounts")
      .select("id, email, lovable_connection_id, status")
      .eq("id", data.accountId)
      .maybeSingle();
    if (acctErr) throw new Error(acctErr.message);
    if (!account) throw new Error("Account not found");
    if (!account.lovable_connection_id)
      throw new Error("Mailbox is not connected. Please reconnect Gmail.");

    // Create job
    const { data: jobRow, error: jobErr } = await supabase
      .from("email_sync_jobs")
      .insert({
        account_id: account.id,
        user_id: userId,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (jobErr) throw new Error(jobErr.message);

    let processed = 0;
    let imported = 0;
    try {
      const { callAsAppUser } = await import("@/integrations/lovable/appUserConnector");
      const { parseEmail, extractBody } = await import("@/lib/email-parsers.server");

      // Search last 90d for financial-looking emails
      const query = [
        "newer_than:90d",
        "(",
        [
          "from:paystack",
          "from:flutterwave",
          "from:gtbank",
          "from:opay",
          "from:moniepoint",
          "from:palmpay",
          "from:kuda",
          'subject:receipt',
          'subject:invoice',
          'subject:"payment"',
          'subject:"debit alert"',
          'subject:"credit alert"',
          'subject:"transaction alert"',
        ].join(" OR "),
        ")",
      ].join(" ");

      const listUrl = `/gmail/v1/users/me/messages?maxResults=100&q=${encodeURIComponent(query)}`;
      const listRes = await callAsAppUser({
        gatewayBaseUrl: GATEWAY_BASE_URL,
        connectionId: account.lovable_connection_id,
        connectorId: "google_mail",
        path: listUrl,
      });
      if (!listRes.ok) {
        const t = await listRes.text();
        throw new Error(`Gmail list failed (${listRes.status}): ${t.slice(0, 200)}`);
      }
      const listJson = (await listRes.json()) as { messages?: { id: string }[] };
      const messageIds = (listJson.messages || []).map((m) => m.id);

      // Filter out already-imported message ids
      let toFetch = messageIds;
      if (messageIds.length) {
        const { data: existing } = await supabase
          .from("email_imported_messages")
          .select("gmail_message_id")
          .eq("account_id", account.id)
          .in("gmail_message_id", messageIds);
        const seen = new Set((existing || []).map((r) => r.gmail_message_id));
        toFetch = messageIds.filter((id) => !seen.has(id));
      }

      for (const id of toFetch) {
        processed += 1;
        const msgRes = await callAsAppUser({
          gatewayBaseUrl: GATEWAY_BASE_URL,
          connectionId: account.lovable_connection_id,
          connectorId: "google_mail",
          path: `/gmail/v1/users/me/messages/${id}?format=full`,
        });
        if (!msgRes.ok) continue;
        const msg = (await msgRes.json()) as {
          id: string;
          internalDate: string;
          payload?: { headers?: { name: string; value: string }[] };
        };
        const headers = msg.payload?.headers || [];
        const h = (n: string) =>
          headers.find((x) => x.name.toLowerCase() === n.toLowerCase())?.value || "";
        const body = extractBody(msg.payload);
        const parsed = parseEmail({
          from: h("From"),
          subject: h("Subject"),
          body,
          internalDate: msg.internalDate || `${Date.now()}`,
        });

        if (!parsed) {
          await supabase.from("email_imported_messages").insert({
            account_id: account.id,
            user_id: userId,
            gmail_message_id: id,
            parsed_status: "skipped",
          });
          continue;
        }

        const validCategories = [
          "food", "transport", "utilities", "salary", "marketing",
          "software", "subscription", "inventory", "operations", "miscellaneous",
        ];
        const category = validCategories.includes(parsed.category) ? parsed.category : "miscellaneous";

        const { data: txn, error: txnErr } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            type: parsed.type,
            category,
            amount: parsed.amount,
            date: parsed.date,
            note: h("Subject").slice(0, 200) || null,
            source: "email" as const,
            email_account_id: account.id,
            email_message_id: id,
            confidence: parsed.confidence,
            merchant: parsed.merchant,
            reference: parsed.reference,
            currency: parsed.currency,
            imported_at: new Date().toISOString(),
            needs_review: parsed.confidence < 0.75,
          })
          .select("id")
          .single();

        if (txnErr) continue;

        await supabase.from("email_imported_messages").insert({
          account_id: account.id,
          user_id: userId,
          gmail_message_id: id,
          transaction_id: txn.id,
          parser_name: parsed.parserName,
          parsed_status: "imported",
        });
        imported += 1;
      }

      await supabase
        .from("email_sync_jobs")
        .update({
          status: "success",
          finished_at: new Date().toISOString(),
          processed_count: processed,
          imported_count: imported,
        })
        .eq("id", jobRow.id);

      await supabase
        .from("email_accounts")
        .update({ last_synced_at: new Date().toISOString(), last_error: null, status: "connected" })
        .eq("id", account.id);

      return { ok: true, processed, imported };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sync failed";
      await supabase
        .from("email_sync_jobs")
        .update({
          status: "failed",
          finished_at: new Date().toISOString(),
          processed_count: processed,
          imported_count: imported,
          error: message,
        })
        .eq("id", jobRow.id);
      await supabase
        .from("email_accounts")
        .update({ last_error: message, status: /unauthorized|401|invalid_grant/i.test(message) ? "reauth_required" : "error" })
        .eq("id", account.id);
      throw new Error(message);
    }
  });
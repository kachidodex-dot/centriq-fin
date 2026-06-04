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
    // Mark disconnected and clear tokens
    const { error } = await supabase
      .from("email_accounts")
      .update({
        status: "disconnected" as const,
        access_token_enc: null,
        refresh_token_enc: null,
        token_expires_at: null,
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

// Phase 2 stub: starts the OAuth + sync flow. For now returns a friendly message.
export const triggerEmailSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ accountId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Create a queued job placeholder so the UI shows real history.
    const { error } = await supabase.from("email_sync_jobs").insert({
      account_id: data.accountId,
      user_id: userId,
      status: "queued",
    });
    if (error) throw new Error(error.message);
    return { ok: true, queued: true };
  });
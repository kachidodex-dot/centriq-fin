import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, RefreshCw, Plug, PlugZap, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  listEmailAccounts,
  disconnectEmailAccount,
  deleteEmailAccount,
  triggerEmailSync,
  startGmailConnect,
  completeGmailConnect,
  type EmailAccountSummary,
} from "@/lib/email-accounts.functions";
import { connectAppUser } from "@/integrations/lovable/appUserConnectorClient";

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev";

function StatusBadge({ status }: { status: EmailAccountSummary["status"] }) {
  if (status === "connected")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/20">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
      </Badge>
    );
  if (status === "reauth_required")
    return (
      <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15 border-amber-500/20">
        <AlertTriangle className="mr-1 h-3 w-3" /> Reconnect required
      </Badge>
    );
  if (status === "error")
    return (
      <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15 border-destructive/20">
        <AlertTriangle className="mr-1 h-3 w-3" /> Error
      </Badge>
    );
  return <Badge variant="secondary">Disconnected</Badge>;
}

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function EmailIntegrations() {
  const qc = useQueryClient();
  const listFn = useServerFn(listEmailAccounts);
  const disconnectFn = useServerFn(disconnectEmailAccount);
  const deleteFn = useServerFn(deleteEmailAccount);
  const syncFn = useServerFn(triggerEmailSync);
  const startFn = useServerFn(startGmailConnect);
  const completeFn = useServerFn(completeGmailConnect);

  const { data, isLoading } = useQuery({
    queryKey: ["email_accounts"],
    queryFn: () => listFn(),
  });

  const accounts = Array.isArray(data) ? data : [];

  const disconnect = useMutation({
    mutationFn: (id: string) => disconnectFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Account disconnected");
      qc.invalidateQueries({ queryKey: ["email_accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Account removed");
      qc.invalidateQueries({ queryKey: ["email_accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sync = useMutation({
    mutationFn: (accountId: string) => syncFn({ data: { accountId } }),
    onSuccess: (res: { processed?: number; imported?: number }) => {
      const imported = res?.imported ?? 0;
      const processed = res?.processed ?? 0;
      toast.success(
        imported > 0
          ? `Imported ${imported} new transaction${imported === 1 ? "" : "s"}`
          : processed > 0
            ? "Sync complete · no new transactions"
            : "Sync complete · nothing new",
      );
      qc.invalidateQueries({ queryKey: ["email_accounts"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const connect = useMutation({
    mutationFn: async () => {
      const result = await connectAppUser({
        connectorId: "google_mail",
        gatewayBaseUrl: GATEWAY_BASE_URL,
        start: (targetOrigin) => startFn({ data: { targetOrigin } }),
      });
      if (!result.success || !result.connectionId) {
        throw new Error(result.error || "Gmail connection failed");
      }
      return completeFn({ data: { connectionId: result.connectionId } });
    },
    onSuccess: (res: { email?: string }) => {
      toast.success(`Connected ${res?.email ?? "Gmail"}`);
      qc.invalidateQueries({ queryKey: ["email_accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const connectGmail = () => connect.mutate();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> Email integrations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect a mailbox and Ryport AI will automatically import financial transactions
            from receipts, bank alerts, and invoices.
          </p>
        </div>
        <Button onClick={connectGmail} className="shrink-0" disabled={connect.isPending}>
          <PlugZap className={`mr-2 h-4 w-4 ${connect.isPending ? "animate-pulse" : ""}`} />
          {connect.isPending ? "Connecting…" : "Connect Gmail"}
        </Button>
      </div>

      <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground">
        <div className="font-medium text-foreground mb-1">Read-only & secure</div>
        Ryport requests Gmail <span className="font-medium">read-only</span> access via Google OAuth.
        Your password is never shared. Tokens are encrypted at rest and you can disconnect at any time.
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading accounts…
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-xl border border-border bg-background/50 p-6 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium">No mailboxes connected</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect Gmail to start importing transactions automatically.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {accounts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{a.email}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.provider.toUpperCase()} · Last synced {timeAgo(a.last_synced_at)}
                  {a.last_error ? ` · ${a.last_error}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "connected" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sync.mutate(a.id)}
                      disabled={sync.isPending}
                    >
                      <RefreshCw className={`mr-2 h-3.5 w-3.5 ${sync.isPending ? "animate-spin" : ""}`} />
                      Sync now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnect.mutate(a.id)}
                      disabled={disconnect.isPending}
                    >
                      <Plug className="mr-2 h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={connectGmail}>
                      <PlugZap className="mr-2 h-3.5 w-3.5" />
                      Reconnect
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove.mutate(a.id)}
                      disabled={remove.isPending}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EmailIntegrations;
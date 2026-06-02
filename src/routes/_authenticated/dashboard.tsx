import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { IncomeExpensesChart, CategoryChart } from "@/components/dashboard/charts";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { useTransactions, useProfile } from "@/hooks/use-data";
import Currency from "@/components/ui/currency";
import { generateInsights, healthScore } from "@/lib/insights";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Transaction } from "@/lib/types";
import logo from "@/assets/ryport-logo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ryport" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: txs, refetch, loading } = useTransactions();
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const currency = profile?.currency || "USD";

  const { income, expenses, profit, score } = useMemo(() => {
    const i = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const e = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { income: i, expenses: e, profit: i - e, score: Math.round(healthScore(i, e)) };
  }, [txs]);

  const insights = useMemo(() => generateInsights(txs), [txs]);

  const onDelete = async (t: Transaction) => {
    const { error } = await supabase.from("transactions").delete().eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success("Transaction deleted");
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <img src={logo} alt="Ryport" className="hidden sm:block h-14 w-14 rounded-full object-contain shadow-glow ring-1 ring-primary/20" />
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> Live overview
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back{profile?.business_name ? <>, <span className="text-gradient">{profile.business_name}</span></> : ""}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Here's how your business is performing today.</p>
          </div>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2 shadow-glow"><Plus className="h-4 w-4" /> Add transaction</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total income" value={<Currency amount={income} currency={currency} />} icon={<TrendingUp className="h-4 w-4" />} accent="success" />
        <StatCard label="Total expenses" value={<Currency amount={expenses} currency={currency} />} icon={<TrendingDown className="h-4 w-4" />} accent="destructive" />
        <StatCard label="Net profit" value={<Currency amount={profit} currency={currency} />} icon={<Wallet className="h-4 w-4" />} accent="primary" sub={profit >= 0 ? "In the green" : "In the red"} />
        <StatCard label="Health score" value={`${score}/100`} icon={<Activity className="h-4 w-4" />} accent={score >= 70 ? "success" : score >= 50 ? "warning" : "destructive"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2"><IncomeExpensesChart txs={txs} /></div>
        <InsightsPanel insights={insights} txs={txs} currency={currency} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <CategoryChart txs={txs} />
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent transactions</h2>
          </div>
          {loading ? <div className="text-sm text-muted-foreground">Loading…</div> :
            <TransactionTable txs={txs.slice(0, 8)} currency={currency} onEdit={(t) => { setEditing(t); setOpen(true); }} onDelete={onDelete} />}
        </div>
      </div>

      <TransactionForm open={open} onOpenChange={setOpen} editing={editing} onSaved={refetch} />
    </div>
  );
}

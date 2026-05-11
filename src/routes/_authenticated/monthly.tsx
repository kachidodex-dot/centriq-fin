import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Award } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useTransactions, useProfile } from "@/hooks/use-data";
import { formatCurrency } from "@/lib/format";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_authenticated/monthly")({
  head: () => ({ meta: [{ title: "Monthly Summary — Zentriq" }] }),
  component: MonthlyPage,
});

function MonthlyPage() {
  const { data: txs } = useTransactions();
  const { profile } = useProfile();
  const currency = profile?.currency || "USD";

  const { monthIncome, monthExpenses, monthProfit, topCat, byMonth } = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); const year = now.getFullYear();
    const inMonth = txs.filter(t => { const d = new Date(t.date); return d.getMonth() === month && d.getFullYear() === year; });
    const i = inMonth.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const e = inMonth.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const cats: Record<string, number> = {};
    inMonth.filter(t => t.type === "expense").forEach(t => { cats[t.category] = (cats[t.category] || 0) + Number(t.amount); });
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];

    const months: Record<string, { month: string; income: number; expenses: number }> = {};
    txs.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      if (t.type === "income") months[key].income += Number(t.amount); else months[key].expenses += Number(t.amount);
    });
    const series = Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

    return { monthIncome: i, monthExpenses: e, monthProfit: i - e, topCat: top?.[0] || "—", byMonth: series };
  }, [txs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monthly summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">A clear view of this month's performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This month income" value={formatCurrency(monthIncome, currency)} icon={<TrendingUp className="h-4 w-4" />} accent="success" />
        <StatCard label="This month expenses" value={formatCurrency(monthExpenses, currency)} icon={<TrendingDown className="h-4 w-4" />} accent="destructive" />
        <StatCard label="Profit / loss" value={formatCurrency(monthProfit, currency)} icon={<Wallet className="h-4 w-4" />} accent="primary" />
        <StatCard label="Top category" value={topCat} icon={<Award className="h-4 w-4" />} accent="warning" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-semibold">Last 6 months</h3>
        <p className="text-xs text-muted-foreground">Income vs expenses trend</p>
        <div className="mt-4 h-72">
          {byMonth.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-destructive)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import type { Transaction } from "@/lib/types";

export function IncomeExpensesChart({ txs }: { txs: Transaction[] }) {
  const byDate: Record<string, { date: string; income: number; expenses: number }> = {};
  txs.forEach((t) => {
    const k = t.date;
    if (!byDate[k]) byDate[k] = { date: k, income: 0, expenses: 0 };
    if (t.type === "income") byDate[k].income += Number(t.amount);
    else byDate[k].expenses += Number(t.amount);
  });
  const data = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);

  return (
    <div className="glow-card rounded-2xl p-5 shadow-soft h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Income vs Expenses</h3>
          <p className="text-xs text-muted-foreground">Last 30 entries</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Income</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Expenses</span>
        </div>
      </div>
      <div className="mt-4 h-72">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.5} /><stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} /></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.5} /><stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 6" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, boxShadow: "var(--shadow-elevated)" }} />
              <Area type="monotone" dataKey="income" stroke="var(--color-success)" fill="url(#inc)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expenses" stroke="var(--color-destructive)" fill="url(#exp)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)"];

export function CategoryChart({ txs }: { txs: Transaction[] }) {
  const byCat: Record<string, number> = {};
  txs.filter((t) => t.type === "expense").forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount); });
  const data = Object.entries(byCat).map(([name, value]) => ({ name, value }));

  return (
    <div className="glow-card rounded-2xl p-5 shadow-soft h-full">
      <h3 className="font-semibold">Spending by Category</h3>
      <p className="text-xs text-muted-foreground">Where your money goes</p>
      <div className="mt-4 h-56 sm:h-64">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">No expenses yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 12, right: 0, bottom: 28, left: 0 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="40%"
                outerRadius="65%"
                paddingAngle={3}
                stroke="var(--color-background)"
                strokeWidth={2}
              >
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-elevated)",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, marginTop: 8, whiteSpace: "normal" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

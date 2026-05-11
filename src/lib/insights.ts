import type { Transaction } from "./types";

export function generateInsights(txs: Transaction[]): string[] {
  if (!txs.length) return ["Add your first transaction to unlock AI-powered insights."];
  const insights: string[] = [];
  const income = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  if (expenses > income && income > 0) insights.push("You're spending more than you earn this period. Consider trimming variable costs.");
  else if (income > expenses) insights.push(`Healthy margin: you saved ${(((income - expenses) / income) * 100).toFixed(0)}% of income.`);

  const byCat: Record<string, number> = {};
  txs.filter(t => t.type === "expense").forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount); });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (top) insights.push(`${top[0].charAt(0).toUpperCase() + top[0].slice(1)} is your largest expense category.`);

  const now = new Date();
  const thisWeek = txs.filter(t => (now.getTime() - new Date(t.date).getTime()) < 7 * 86400000 && t.type === "expense");
  const lastWeek = txs.filter(t => {
    const diff = now.getTime() - new Date(t.date).getTime();
    return diff >= 7 * 86400000 && diff < 14 * 86400000 && t.type === "expense";
  });
  const tw = thisWeek.reduce((s, t) => s + Number(t.amount), 0);
  const lw = lastWeek.reduce((s, t) => s + Number(t.amount), 0);
  if (lw > 0) {
    const change = ((tw - lw) / lw) * 100;
    if (Math.abs(change) > 10) insights.push(`Spending ${change > 0 ? "rose" : "fell"} ${Math.abs(change).toFixed(0)}% week-over-week.`);
  }

  return insights.slice(0, 4);
}

export function healthScore(income: number, expenses: number): number {
  if (income === 0 && expenses === 0) return 50;
  if (income === 0) return 10;
  const ratio = expenses / income;
  if (ratio <= 0.5) return 95;
  if (ratio <= 0.7) return 82;
  if (ratio <= 0.9) return 68;
  if (ratio <= 1) return 55;
  return Math.max(15, 55 - (ratio - 1) * 40);
}

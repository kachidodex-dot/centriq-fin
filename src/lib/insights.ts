import type { Transaction } from "./types";
import {
  MS_PER_WEEK,
  SPENDING_TREND_WEEKS,
  SPENDING_CHANGE_THRESHOLD_PERCENT,
  MAX_INSIGHTS_COUNT,
  HEALTHY_MARGIN_RATIO,
  OK_EXPENSE_RATIO,
  WARNING_EXPENSE_RATIO,
  CRITICAL_EXPENSE_RATIO,
  HEALTH_SCORE_EXCELLENT,
  HEALTH_SCORE_GOOD,
  HEALTH_SCORE_FAIR,
  HEALTH_SCORE_POOR,
  HEALTH_SCORE_MINIMUM,
  HEALTH_SCORE_DECLINE_RATE,
} from "./constants";

/**
 * Generates AI-powered financial insights based on transaction history.
 * Analyzes spending patterns, margins, and week-over-week trends.
 *
 * @param txs Array of transactions to analyze
 * @returns Array of insight strings (max 4)
 */
export function generateInsights(txs: Transaction[]): string[] {
  if (!txs.length) return ["Add your first transaction to unlock AI-powered insights."];

  const insights: string[] = [];
  const income = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  // Insight 1: Profit margin analysis
  if (expenses > income && income > 0) {
    insights.push("You're spending more than you earn this period. Consider trimming variable costs.");
  } else if (income > expenses) {
    insights.push(`Healthy margin: you saved ${(((income - expenses) / income) * 100).toFixed(0)}% of income.`);
  }

  // Insight 2: Largest expense category
  const byCat: Record<string, number> = {};
  txs.filter(t => t.type === "expense").forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount);
  });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (top) {
    insights.push(`${top[0].charAt(0).toUpperCase() + top[0].slice(1)} is your largest expense category.`);
  }

  // Insight 3: Week-over-week spending trend
  const now = new Date();
  const thisWeekStart = now.getTime() - MS_PER_WEEK * (SPENDING_TREND_WEEKS - 1);
  const lastWeekStart = now.getTime() - MS_PER_WEEK * SPENDING_TREND_WEEKS;

  const thisWeek = txs.filter(
    t => new Date(t.date).getTime() >= thisWeekStart && t.type === "expense",
  );
  const lastWeek = txs.filter(
    t => {
      const txTime = new Date(t.date).getTime();
      return txTime >= lastWeekStart && txTime < thisWeekStart && t.type === "expense";
    },
  );

  const tw = thisWeek.reduce((s, t) => s + Number(t.amount), 0);
  const lw = lastWeek.reduce((s, t) => s + Number(t.amount), 0);

  if (lw > 0) {
    const change = ((tw - lw) / lw) * 100;
    if (Math.abs(change) > SPENDING_CHANGE_THRESHOLD_PERCENT) {
      insights.push(
        `Spending ${change > 0 ? "rose" : "fell"} ${Math.abs(change).toFixed(0)}% week-over-week.`,
      );
    }
  }

  return insights.slice(0, MAX_INSIGHTS_COUNT);
}

/**
 * Calculates a financial health score based on expense-to-income ratio.
 * Score ranges from 15 (critical) to 95 (excellent).
 *
 * @param income Total income in period
 * @param expenses Total expenses in period
 * @returns Health score (0-100)
 */
export function healthScore(income: number, expenses: number): number {
  // Edge cases
  if (income === 0 && expenses === 0) return 50;
  if (income === 0) return HEALTH_SCORE_MINIMUM;

  const ratio = expenses / income;

  // Tiered scoring based on expense ratio
  if (ratio <= HEALTHY_MARGIN_RATIO) return HEALTH_SCORE_EXCELLENT;
  if (ratio <= OK_EXPENSE_RATIO) return HEALTH_SCORE_GOOD;
  if (ratio <= WARNING_EXPENSE_RATIO) return HEALTH_SCORE_FAIR;
  if (ratio <= CRITICAL_EXPENSE_RATIO) return HEALTH_SCORE_POOR;

  // For ratios > 1.0, decline score based on overspend
  return Math.max(HEALTH_SCORE_MINIMUM, HEALTH_SCORE_POOR - (ratio - 1) * HEALTH_SCORE_DECLINE_RATE);
}

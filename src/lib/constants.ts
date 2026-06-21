/**
 * Application-wide constants and magic number definitions.
 * Centralized configuration for easy maintenance and updates.
 */

// === Time Constants ===
/** Milliseconds per week */
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Milliseconds per day */
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

// === Financial Insights Configuration ===
/** Number of weeks to use for spending trend analysis */
export const SPENDING_TREND_WEEKS = 2;

/** Percentage threshold for significant spending changes (week-over-week) */
export const SPENDING_CHANGE_THRESHOLD_PERCENT = 10;

/** Maximum number of insights to generate */
export const MAX_INSIGHTS_COUNT = 4;

/** Number of recent transactions to include in AI context */
export const RECENT_TRANSACTIONS_LIMIT = 15;

/** Minimum revenue ratio (expenses/income) for healthy margin threshold */
export const HEALTHY_MARGIN_RATIO = 0.5;

/** Expense ratio for "OK" financial health */
export const OK_EXPENSE_RATIO = 0.7;

/** Expense ratio for "Warning" financial health */
export const WARNING_EXPENSE_RATIO = 0.9;

/** Expense ratio for "Critical" financial health */
export const CRITICAL_EXPENSE_RATIO = 1.0;

// === Health Score Thresholds ===
/** Perfect health score for expenses under 50% of income */
export const HEALTH_SCORE_EXCELLENT = 95;

/** Good health score for expenses 50-70% of income */
export const HEALTH_SCORE_GOOD = 82;

/** Fair health score for expenses 70-90% of income */
export const HEALTH_SCORE_FAIR = 68;

/** Poor health score for expenses 90-100% of income */
export const HEALTH_SCORE_POOR = 55;

/** Minimum health score (when spending exceeds income) */
export const HEALTH_SCORE_MINIMUM = 15;

/** Decline rate for health score per 0.1 of expense ratio over 1.0 */
export const HEALTH_SCORE_DECLINE_RATE = 40;

// === Admin Dashboard Configuration ===
/** Maximum number of records to fetch per query */
export const ADMIN_RECORDS_LIMIT = 25;

/** Number of months to show in dashboard charts */
export const DASHBOARD_CHART_MONTHS = 6;

/** Maximum categories to show in revenue breakdown chart */
export const MAX_REVENUE_CATEGORIES = 6;

// === AI Assistant Configuration ===
/** AI model to use for financial insights */
export const AI_MODEL = "google/gemini-3-flash-preview";

/** AI gateway base URL */
export const AI_GATEWAY_BASE_URL = "https://ai.gateway.lovable.dev/v1";

/** Maximum response length for AI assistant (words) */
export const AI_MAX_RESPONSE_LENGTH_WORDS = 180;

/** Recommended number of insights to provide when asked */
export const AI_SUGGESTED_INSIGHTS_COUNT = 3;

// === Transaction Categories ===
export const TRANSACTION_CATEGORIES = {
  INVENTORY: "inventory",
  FOOD: "food",
  TRANSPORT: "transport",
  UTILITIES: "utilities",
  SALARY: "salary",
  MISCELLANEOUS: "miscellaneous",
} as const;

// === Transaction Types ===
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

// === Pagination ===
/** Default page size for paginated results */
export const DEFAULT_PAGE_SIZE = 10;

/** Maximum page size to prevent excessive data loading */
export const MAX_PAGE_SIZE = 100;

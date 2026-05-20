// Mock data removed. All admin pages now read live data from Supabase.
// These empty exports are kept so existing imports compile during the
// transition to fully real-data-backed pages.
import type { ActivityItem } from "@/admin/components/activity-feed";

export const mockUsers: any[] = [];
export const mockTransactions: any[] = [];
export const mockActivity: ActivityItem[] = [];
export const mockFeedback: any[] = [];

export const chartData = {
  userGrowth: [] as { month: string; value: number }[],
  transactionVolume: [] as { month: string; value: number }[],
  revenueByCategory: [] as { name: string; value: number }[],
  platformUsage: [] as { day: string; users: number }[],
};

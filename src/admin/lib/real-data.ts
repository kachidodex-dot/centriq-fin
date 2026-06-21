import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface UserListItem {
  id: string;
  name: string;
  email: string;
  business: string;
  plan: "Starter";
  status: "active";
  joinDate: string;
  avatar: string;
}

/**
 * Fetches the most recent 25 user profiles from Supabase.
 * @returns Array of user data formatted for admin display
 */
export async function fetchRealUsers(): Promise<UserListItem[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return (data || []).map((user: ProfileRow) => {
      const name = user.business_name || "Unnamed business";
      return {
        id: user.id,
        name,
        email: `${String(user.id).slice(0, 8)}…`,
        business: name,
        plan: "Starter" as const,
        status: "active" as const,
        joinDate: new Date(user.created_at || Date.now()).toISOString().split("T")[0],
        avatar: name.substring(0, 2).toUpperCase(),
      };
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

interface TransactionListItem {
  id: string;
  user: string;
  category: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  status: "completed";
}

/**
 * Fetches the most recent 25 transactions from Supabase.
 * @returns Array of transaction data formatted for admin display
 */
export async function fetchRealTransactions(): Promise<TransactionListItem[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);

    if (error || !data) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    return data.map((txn: TransactionRow) => ({
      id: txn.id,
      user: `${String(txn.user_id).slice(0, 8)}…`,
      category: String(txn.category) || "general",
      amount: Number(txn.amount) || 0,
      type: txn.type === "expense" ? ("debit" as const) : ("credit" as const),
      date: (txn.date || txn.created_at || "").toString().split("T")[0],
      status: "completed" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  monthlyRevenue: number;
  activeToday: number;
  totalTransactions: number;
  charts: {
    userGrowth: Array<{ month: string; value: number }>;
    transactionVolume: Array<{ month: string; value: number }>;
    revenueByCategory: Array<{ name: string; value: number }>;
  };
}

/**
 * Fetches aggregated dashboard statistics from Supabase.
 * Includes user counts, transaction metrics, and category breakdown.
 * @returns Dashboard statistics or defaults on error
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [usersRes, transactionsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("amount, type, date, category, user_id", { count: "exact" }),
    ]);

    const totalUsers = usersRes.count || 0;
    const totalTransactions = transactionsRes.count || 0;
    const txs: TransactionRow[] = transactionsRes.data || [];
    const totalRevenue = txs
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Real "active today" = users who logged a transaction today
    const today = new Date().toISOString().split("T")[0];
    const activeToday = new Set(
      txs.filter(t => (t.date || "").startsWith(today)).map(t => t.user_id)
    ).size;

    // Build monthly series from real transactions (last 6 months)
    const now = new Date();
    const months: { month: string; key: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString("en", { month: "short" }),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      });
    }
    const userGrowth = months.map(m => ({ month: m.month, value: 0 }));
    const transactionVolume = months.map(m => ({
      month: m.month,
      value: txs.filter((t: TransactionRow) => (t.date || "").startsWith(m.key)).length,
    }));
    const catMap: Record<string, number> = {};
    txs.forEach((t: TransactionRow) => {
      const c = String(t.category) || "Other";
      catMap[c] = (catMap[c] || 0) + Number(t.amount || 0);
    });
    const revenueByCategory = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    return {
      totalUsers,
      totalBusinesses: totalUsers,
      monthlyRevenue: totalRevenue,
      activeToday,
      totalTransactions,
      charts: { userGrowth, transactionVolume, revenueByCategory },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalUsers: 0,
      totalBusinesses: 0,
      monthlyRevenue: 0,
      activeToday: 0,
      totalTransactions: 0,
      charts: { userGrowth: [], transactionVolume: [], revenueByCategory: [] },
    };
  }
}

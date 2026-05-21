import { supabase } from "@/integrations/supabase/client";

// Fetch real users from Supabase
export async function fetchRealUsers() {
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

    return (data || []).map((row) => {
      const user = row as any;
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

// Fetch real transactions
export async function fetchRealTransactions() {
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

    return data.map((row) => {
      const txn = row as any;
      return {
        id: txn.id,
        user: `${String(txn.user_id).slice(0, 8)}…`,
        category: txn.category || "general",
        amount: Number(txn.amount) || 0,
        type: txn.type === "expense" ? "debit" : "credit",
        date: (txn.date || txn.created_at || "").toString().split("T")[0],
        status: "completed" as const,
      };
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

// Get dashboard statistics from Supabase
export async function fetchDashboardStats() {
  try {
    const [usersRes, transactionsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("amount, type, date, category", { count: "exact" }),
    ]);

    const totalUsers = usersRes.count || 0;
    const totalTransactions = transactionsRes.count || 0;
    const txs: any[] = transactionsRes.data || [];
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
      value: txs.filter(t => (t.date || "").startsWith(m.key)).length,
    }));
    const catMap: Record<string, number> = {};
    txs.forEach(t => {
      const c = t.category || "Other";
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

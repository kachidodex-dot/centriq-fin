import { useEffect, useState } from "react";
import { Users, Building2, CreditCard, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { MetricCard } from "@/admin/components/metric-card";
import { DashboardSection, ChartContainer } from "@/admin/components/dashboard-sections";
import { ActivityFeed } from "@/admin/components/activity-feed";
import { fetchDashboardStats } from "@/admin/lib/real-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export function AdminOverviewPage() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalBusinesses: 0,
    monthlyRevenue: 0,
    activeToday: 0,
    totalTransactions: 0,
    charts: { userGrowth: [], transactionVolume: [], revenueByCategory: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your platform overview."
    >
      {/* Top Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Users" value={stats.totalUsers.toLocaleString()} icon={<Users className="h-6 w-6" />} description="Registered accounts" />
        <MetricCard label="Total Businesses" value={stats.totalBusinesses.toLocaleString()} icon={<Building2 className="h-6 w-6" />} description="With business profile" />
        <MetricCard label="Total Revenue" value={`$${(stats.monthlyRevenue / 1000).toFixed(1)}K`} icon={<CreditCard className="h-6 w-6" />} description="All-time income" />
        <MetricCard label="Transactions" value={(stats.totalTransactions || 0).toLocaleString()} icon={<TrendingUp className="h-6 w-6" />} description="Recorded to date" />
      </div>

      {/* Charts Section */}
      <DashboardSection
        title="Growth Analytics"
        description="Monitor key platform metrics and trends"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User Growth Chart */}
          <ChartContainer title="User Growth">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.charts?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Transaction Volume Chart */}
          <ChartContainer title="Transaction Volume">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.charts?.transactionVolume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </DashboardSection>

      {/* Recent Activity Section */}
      <DashboardSection
        title="Recent Activity"
        description="Latest platform events and user actions"
      >
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <ActivityFeed items={[]} />
        </div>
      </DashboardSection>

      {/* Quick Stats */}
      <DashboardSection title="Quick Stats">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">New Signups (Today)</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">47</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">↑ 12% vs yesterday</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed Transactions</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">1,847</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Total value: $2.4M</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Requests</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">12,482</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">↑ 8% vs last week</p>
          </div>
        </div>
      </DashboardSection>
    </AdminLayout>
  );
}

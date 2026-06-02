import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection } from "@/admin/components/dashboard-sections";
import { ActivityFeed, type ActivityItem } from "@/admin/components/activity-feed";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const activityCategories = ["All", "Transactions", "Signups"];

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function AdminActivityPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const [{ data: txs }, { data: profiles }] = await Promise.all([
        supabase
          .from("transactions")
          .select("id, amount, type, category, date, created_at, user_id")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("profiles")
          .select("id, business_name, created_at")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      return { txs: txs ?? [], profiles: profiles ?? [] };
    },
    refetchInterval: 30000,
  });

  const allActivity = useMemo<ActivityItem[]>(() => {
    const txItems: ActivityItem[] = (data?.txs ?? []).map((t) => ({
      id: `tx-${t.id}`,
      type: "transaction",
      user: "User",
      description: `${t.type === "income" ? "Recorded income" : "Recorded expense"} · ${t.category ?? "Uncategorized"} · $${Number(t.amount).toLocaleString()}`,
      timestamp: formatRelative(t.created_at ?? t.date),
    }));
    const userItems: ActivityItem[] = (data?.profiles ?? []).map((p) => ({
      id: `user-${p.id}`,
      type: "signup",
      user: p.business_name ?? "New user",
      description: "Joined Ryport",
      timestamp: formatRelative(p.created_at),
    }));
    return [...txItems, ...userItems].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );
  }, [data]);

  const displayActivity =
    selectedCategory === "All"
      ? allActivity
      : allActivity.filter((a) =>
          selectedCategory === "Transactions" ? a.type === "transaction" : a.type === "signup",
        );

  const todayCount = displayActivity.length;
  const newSignups = (data?.profiles ?? []).filter(
    (p) => Date.now() - new Date(p.created_at).getTime() < 86400000,
  ).length;
  const txCount = (data?.txs ?? []).filter(
    (t) => Date.now() - new Date(t.created_at ?? t.date).getTime() < 86400000,
  ).length;

  return (
    <AdminLayout
      title="Activity Logs"
      subtitle="Monitor all platform activities and system events"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Today's Activities</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{isLoading ? "—" : todayCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">New Signups</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{isLoading ? "—" : newSignups}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{isLoading ? "—" : txCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">System Events</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">0</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <DashboardSection
        title="Activity Timeline"
        action={
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading activity…</p>
          ) : displayActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity recorded yet.</p>
          ) : (
            <ActivityFeed items={displayActivity} />
          )}
        </div>
      </DashboardSection>

      {/* Export Section */}
      <DashboardSection>
        <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Export Activity Logs</h3>
              <p className="text-sm text-gray-600 mt-1">
                Download detailed activity logs for compliance and auditing
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">CSV</Button>
              <Button variant="outline">JSON</Button>
              <Button>Export</Button>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Detailed Event Log */}
      <DashboardSection title="Detailed Event Log">
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {displayActivity.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-900">{activity.user}</td>
                  <td className="px-6 py-3 text-gray-600">{activity.timestamp}</td>
                  <td className="px-6 py-3 text-gray-600">{activity.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>
    </AdminLayout>
  );
}

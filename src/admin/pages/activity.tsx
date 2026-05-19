import { useState } from "react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection } from "@/admin/components/dashboard-sections";
import { ActivityFeed } from "@/admin/components/activity-feed";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockActivity } from "@/admin/lib/mock-data";

const activityCategories = [
  "All",
  "User Activity",
  "Admin Actions",
  "Transactions",
  "System",
];

export function AdminActivityPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // In a real app, filter by category
  const displayActivity = mockActivity;

  return (
    <AdminLayout
      title="Activity Logs"
      subtitle="Monitor all platform activities and system events"
    >
      {/* Activity Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Today's Activities</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">247</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">New Signups</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">42</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-green-600">156</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">System Events</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">12</p>
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
          <ActivityFeed items={displayActivity} />
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

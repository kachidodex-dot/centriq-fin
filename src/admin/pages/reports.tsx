import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection, ChartContainer } from "@/admin/components/dashboard-sections";
import { Button } from "@/components/ui/button";
import { chartData } from "@/admin/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AdminReportsPage() {
  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="Comprehensive platform analytics and reports"
    >
      {/* Reports Section */}
      <DashboardSection title="Available Reports">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Signups Report */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Daily Signups</h3>
                <p className="mt-1 text-sm text-gray-600">
                  User registration trends
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Revenue Report */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Monthly revenue breakdown
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Usage Report */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Platform Usage</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Feature adoption & engagement
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button size="sm" className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Charts */}
      <DashboardSection title="Growth Metrics">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Signups */}
          <ChartContainer title="Daily Signups (Last Week)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* User Growth Trend */}
          <ChartContainer title="User Growth Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.userGrowth}>
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
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </DashboardSection>

      {/* Summary Stats */}
      <DashboardSection title="Key Metrics">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">Avg. Signup Rate</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">14.3</p>
            <p className="text-xs text-gray-500 mt-2">Users per day</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">Monthly Growth</p>
            <p className="mt-2 text-3xl font-bold text-green-600">18.5%</p>
            <p className="text-xs text-gray-500 mt-2">User growth rate</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">Churn Rate</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">2.1%</p>
            <p className="text-xs text-gray-500 mt-2">Monthly churn</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">Retention</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">97.9%</p>
            <p className="text-xs text-gray-500 mt-2">User retention</p>
          </div>
        </div>
      </DashboardSection>

      {/* Export All */}
      <DashboardSection>
        <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Generate Full Report</h3>
              <p className="text-sm text-gray-600 mt-1">
                Export comprehensive analytics for investors and stakeholders
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </DashboardSection>
    </AdminLayout>
  );
}

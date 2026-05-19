import { useState } from "react";
import { Search, Filter, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection, ChartContainer } from "@/admin/components/dashboard-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockTransactions, chartData } from "@/admin/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statusColors = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

export function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || txn.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const largeTransactions = mockTransactions.filter((t) => t.amount > 10000);

  return (
    <AdminLayout
      title="Transaction Monitoring"
      subtitle="Track all platform transactions and activity"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {mockTransactions.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Volume</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            ${(totalVolume / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {mockTransactions.filter((t) => t.status === "completed").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Large Transactions</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">
            {largeTransactions.length}
          </p>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <DashboardSection title="Transaction Trends">
        <ChartContainer title="Volume Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.transactionVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </DashboardSection>

      {/* Large Transactions Alert */}
      {largeTransactions.length > 0 && (
        <DashboardSection>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">
                {largeTransactions.length} Large Transactions Detected
              </p>
              <p className="text-sm text-orange-800 mt-1">
                Recent transactions exceeding $10,000. Monitor for fraud.
              </p>
            </div>
          </div>
        </DashboardSection>
      )}

      {/* Search & Filters */}
      <DashboardSection title="Recent Transactions">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{txn.user}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {txn.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {txn.amount.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        txn.type === "debit"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{txn.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusColors[txn.status as keyof typeof statusColors]
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </DashboardSection>
    </AdminLayout>
  );
}

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, UserX, Trash2, Eye } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection } from "@/admin/components/dashboard-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockUsers } from "@/admin/lib/mock-data";
import { fetchRealUsers } from "@/admin/lib/real-data";

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-yellow-100 text-yellow-800",
  inactive: "bg-gray-100 text-gray-800",
};

const planColors = {
  Starter: "text-blue-600 bg-blue-50",
  Pro: "text-purple-600 bg-purple-50",
  Enterprise: "text-indigo-600 bg-indigo-50",
};

export function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const realUsers = await fetchRealUsers();
        if (realUsers.length > 0) {
          setUsers(realUsers);
        } else {
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage and monitor all users on your platform"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {users.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {users.filter((u) => u.status === "suspended").length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <DashboardSection title="Users">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                All Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("suspended")}>
                Suspended
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.business}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        {
                          Starter: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
                          Pro: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950",
                          Enterprise: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950",
                        }[user.plan]
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        user.status === "active"
                          ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400"
                          : user.status === "suspended"
                            ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        {user.status !== "suspended" && (
                          <DropdownMenuItem className="flex items-center gap-2">
                            <UserX className="h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        )}
      </DashboardSection>
    </AdminLayout>
  );
}

import { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useTheme } from "@/admin/hooks/use-theme";
import { useAdminAuth } from "@/admin/hooks/use-admin-auth";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  useTheme(); // Initialize theme on mount
  const { checking, isAdmin } = useAdminAuth();

  if (checking || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-500">Verifying admin access…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="w-full md:ml-64">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

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

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-500">Verifying admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900 px-6">
        <div className="max-w-md rounded-3xl border border-border bg-white/90 p-10 text-center shadow-xl backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Access denied</p>
          <h1 className="mt-4 text-3xl font-bold">Unauthorized Access</h1>
          <p className="mt-3 text-sm text-muted-foreground">You do not have permission to view this admin area.</p>
        </div>
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

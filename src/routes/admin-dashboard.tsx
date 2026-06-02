import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Ryport" }] }),
  component: AdminDashboardRedirect,
});

function AdminDashboardRedirect() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
    navigate({ to: isAdmin ? "/admin" : "/admin/login" });
  }, [user, isAdmin, loading, navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="text-sm text-muted-foreground">Redirecting to admin access…</div>
    </div>
  );
}

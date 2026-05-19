import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsPage } from "@/admin/pages/reports";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsPage,
});

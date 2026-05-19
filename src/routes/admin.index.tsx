import { createFileRoute } from "@tanstack/react-router";
import { AdminOverviewPage } from "@/admin/pages/overview";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

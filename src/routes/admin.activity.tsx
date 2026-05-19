import { createFileRoute } from "@tanstack/react-router";
import { AdminActivityPage } from "@/admin/pages/activity";

export const Route = createFileRoute("/admin/activity")({
  component: AdminActivityPage,
});

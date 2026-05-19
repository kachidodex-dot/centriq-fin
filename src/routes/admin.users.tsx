import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/admin/pages/users";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

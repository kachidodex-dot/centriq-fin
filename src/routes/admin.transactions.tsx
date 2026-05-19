import { createFileRoute } from "@tanstack/react-router";
import { AdminTransactionsPage } from "@/admin/pages/transactions";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactionsPage,
});

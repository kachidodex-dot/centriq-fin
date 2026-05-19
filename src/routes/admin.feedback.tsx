import { createFileRoute } from "@tanstack/react-router";
import { AdminFeedbackPage } from "@/admin/pages/feedback";

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedbackPage,
});

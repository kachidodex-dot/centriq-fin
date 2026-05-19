import { useState } from "react";
import { Star, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection } from "@/admin/components/dashboard-sections";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockFeedback } from "@/admin/lib/mock-data";

const feedbackTypeColors = {
  positive: "bg-green-100 text-green-800",
  suggestion: "bg-blue-100 text-blue-800",
  issue: "bg-red-100 text-red-800",
};

const feedbackStatusColors = {
  new: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
};

export function AdminFeedbackPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredFeedback = selectedStatus
    ? mockFeedback.filter((fb) => fb.status === selectedStatus)
    : mockFeedback;

  return (
    <AdminLayout
      title="Feedback & Support"
      subtitle="User feedback and support tickets"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Feedback</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {mockFeedback.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">New Tickets</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {mockFeedback.filter((fb) => fb.status === "new").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">
            {mockFeedback.filter((fb) => fb.status === "in-progress").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {mockFeedback.filter((fb) => fb.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Feedback List */}
      <DashboardSection title="Support Tickets">
        <div className="mb-6 flex gap-2">
          <Button
            variant={selectedStatus === null ? "default" : "outline"}
            onClick={() => setSelectedStatus(null)}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "new" ? "default" : "outline"}
            onClick={() => setSelectedStatus("new")}
          >
            New
          </Button>
          <Button
            variant={selectedStatus === "in-progress" ? "default" : "outline"}
            onClick={() => setSelectedStatus("in-progress")}
          >
            In Progress
          </Button>
          <Button
            variant={selectedStatus === "resolved" ? "default" : "outline"}
            onClick={() => setSelectedStatus("resolved")}
          >
            Resolved
          </Button>
        </div>

        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {feedback.subject}
                    </h3>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        feedbackTypeColors[
                          feedback.type as keyof typeof feedbackTypeColors
                        ]
                      }`}
                    >
                      {feedback.type}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        feedbackStatusColors[
                          feedback.status as keyof typeof feedbackStatusColors
                        ]
                      }`}
                    >
                      {feedback.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{feedback.message}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      From: {feedback.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {feedback.date}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Full Ticket</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Reviewed</DropdownMenuItem>
                    <DropdownMenuItem>Reply</DropdownMenuItem>
                    <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                    <DropdownMenuItem className="text-green-600">
                      Mark as Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No feedback found</p>
          </div>
        )}
      </DashboardSection>

      {/* Feedback Summary */}
      <DashboardSection title="Sentiment Analysis">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Positive</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {mockFeedback.filter((fb) => fb.type === "positive").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {(
                (mockFeedback.filter((fb) => fb.type === "positive").length /
                  mockFeedback.length) *
                100
              ).toFixed(0)}
              % of total
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Suggestions</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {mockFeedback.filter((fb) => fb.type === "suggestion").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {(
                (mockFeedback.filter((fb) => fb.type === "suggestion").length /
                  mockFeedback.length) *
                100
              ).toFixed(0)}
              % of total
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-red-100 p-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Issues</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {mockFeedback.filter((fb) => fb.type === "issue").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {(
                (mockFeedback.filter((fb) => fb.type === "issue").length /
                  mockFeedback.length) *
                100
              ).toFixed(0)}
              % of total
            </p>
          </div>
        </div>
      </DashboardSection>
    </AdminLayout>
  );
}

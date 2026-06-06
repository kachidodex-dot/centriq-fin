import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: "ok",
          runtime: "node",
          uptime: typeof process !== "undefined" ? process.uptime() : null,
          timestamp: new Date().toISOString(),
        });
      },
    },
  },
});

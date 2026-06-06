import { useEffect, useState } from "react";

type Status = "checking" | "ok" | "down";

export function BackendStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => {
        if (!cancelled) setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const color =
    status === "ok"
      ? "bg-emerald-500"
      : status === "down"
        ? "bg-red-500"
        : "bg-amber-500";
  const label =
    status === "ok"
      ? "Backend is running"
      : status === "down"
        ? "Backend unreachable"
        : "Checking backend…";

  return (
    <div
      className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

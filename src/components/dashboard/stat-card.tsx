import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon, accent, sub }: { label: string; value: string; icon?: ReactNode; accent?: "primary" | "success" | "warning" | "destructive"; sub?: string }) {
  const accentMap = {
    primary: "bg-accent text-accent-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="rounded-2xl border border-border gradient-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        {icon && <div className={cn("grid h-9 w-9 place-items-center rounded-lg", accentMap[accent ?? "primary"])}>{icon}</div>}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon, accent, sub }: { label: string; value: string; icon?: ReactNode; accent?: "primary" | "success" | "warning" | "destructive"; sub?: string }) {
  const accentMap = {
    primary: "from-primary/30 to-primary/5 text-primary ring-primary/30",
    success: "from-success/30 to-success/5 text-success ring-success/30",
    warning: "from-warning/30 to-warning/5 text-warning-foreground ring-warning/30",
    destructive: "from-destructive/30 to-destructive/5 text-destructive ring-destructive/30",
  };
  const a = accentMap[accent ?? "primary"];
  return (
    <div className="glow-card rounded-2xl p-5 shadow-soft group">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{value}</div>
        </div>
        {icon && (
          <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ring-1 transition-transform group-hover:scale-110", a)}>
            {icon}
          </div>
        )}
      </div>
      {sub && <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse-glow" />
        {sub}
      </div>}
    </div>
  );
}

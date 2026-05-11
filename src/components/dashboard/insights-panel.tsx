import { Sparkles } from "lucide-react";

export function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-2xl border border-border gradient-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md gradient-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
        <div>
          <h3 className="font-semibold">AI Insights</h3>
          <p className="text-xs text-muted-foreground">What we noticed about your numbers</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {insights.map((t, i) => (
          <li key={i} className="rounded-lg bg-card border border-border p-3 text-sm">{t}</li>
        ))}
      </ul>
    </div>
  );
}

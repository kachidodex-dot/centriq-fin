import { Sparkles, Send, Wand2 } from "lucide-react";

export function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="glow-card glow-ring rounded-2xl p-5 shadow-elevated relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <div className="flex items-center gap-3 relative">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">AI Assistant
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />Live
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">Real-time financial intelligence</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-3">
        <p className="text-xs text-muted-foreground">Hi there 👋</p>
        <p className="text-sm font-medium mt-0.5">Here's what I noticed today.</p>
      </div>

      <ul className="mt-3 space-y-2 flex-1">
        {insights.map((t, i) => (
          <li key={i} className="group/item rounded-xl border border-border/60 bg-card/30 p-3 text-sm transition hover:border-primary/40 hover:bg-card/60">
            <div className="flex items-start gap-2">
              <Wand2 className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <span className="text-foreground/90">{t}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-2 pl-3 focus-within:border-primary/50 transition">
        <input
          placeholder="Ask anything…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled
        />
        <button className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition" aria-label="Send">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

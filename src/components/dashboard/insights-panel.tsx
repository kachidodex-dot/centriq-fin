import { Sparkles, Send, Wand2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/ai-assistant.functions";
import type { Transaction } from "@/lib/types";
import { toast } from "sonner";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function InsightsPanel({
  insights,
  txs,
  currency,
}: {
  insights: string[];
  txs: Transaction[];
  currency: string;
}) {
  const ask = useServerFn(askAssistant);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const buildContext = () => {
    const income = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expenses = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const byCat: Record<string, number> = {};
    txs.filter(t => t.type === "expense").forEach(t => {
      byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount);
    });
    const topCategories = Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
    const recent = txs.slice(0, 15).map(t => ({
      date: t.date,
      type: t.type,
      category: t.category,
      amount: Number(t.amount),
      description: t.description ?? null,
    }));
    return { income, expenses, profit: income - expenses, currency, topCategories, recent };
  };

  const send = async (prompt?: string) => {
    const content = (prompt ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await ask({ data: { messages: next, context: buildContext() } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (e: any) {
      toast.error(e?.message || "AI request failed");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  };

  const quickActions = [
    "Summarize my revenue",
    "How can I improve my capital?",
    "What's my biggest expense?",
  ];

  return (
    <div className="glow-card glow-ring rounded-2xl p-5 shadow-elevated relative overflow-hidden h-full flex flex-col min-h-[460px]">
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <div className="flex items-center gap-3 relative">
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2">
            AI Assistant
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
              Live
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">Ask anything about your finances</p>
        </div>
      </div>

      <div ref={scrollRef} className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
        {messages.length === 0 ? (
          <>
            <div className="rounded-xl border border-border/60 bg-card/40 p-3">
              <p className="text-xs text-muted-foreground">Hi there 👋</p>
              <p className="text-sm font-medium mt-0.5">Here's what I noticed today.</p>
            </div>
            <ul className="space-y-2">
              {insights.map((t, i) => (
                <li key={i} className="rounded-xl border border-border/60 bg-card/30 p-3 text-sm transition hover:border-primary/40 hover:bg-card/60">
                  <div className="flex items-start gap-2">
                    <Wand2 className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <span className="text-foreground/90">{t}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-6 bg-primary/15 border border-primary/30 text-foreground"
                  : "mr-6 border border-border/60 bg-card/40"
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {busy && (
          <div className="mr-6 rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quickActions.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={busy}
              className="text-[11px] rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-muted-foreground hover:border-primary/40 hover:text-foreground transition disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="mt-3 flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-2 pl-3 focus-within:border-primary/50 transition"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your revenue, capital, or anything…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
          aria-label="Send"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </form>
    </div>
  );
}

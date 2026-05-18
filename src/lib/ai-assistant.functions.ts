import { createServerFn } from "@tanstack/react-start";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

type Msg = { role: "user" | "assistant"; content: string };
type FinanceContext = {
  income: number;
  expenses: number;
  profit: number;
  currency: string;
  topCategories: { category: string; amount: number }[];
  recent: { date: string; type: string; category: string; amount: number; description?: string | null }[];
};

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[]; context: FinanceContext }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const ctx = data.context;
    const system = `You are Zentriq AI, a friendly financial assistant for small business owners.
Be concise, warm, and specific. Use plain English, not accounting jargon.
Format short responses with markdown when useful (bullets, bold). Currency: ${ctx.currency}.

Business snapshot:
- Total income: ${ctx.income.toFixed(2)}
- Total expenses: ${ctx.expenses.toFixed(2)}
- Net profit: ${ctx.profit.toFixed(2)}
- Top expense categories: ${ctx.topCategories.map(c => `${c.category} (${c.amount.toFixed(2)})`).join(", ") || "none"}
- Recent transactions (latest first):
${ctx.recent.slice(0, 15).map(t => `  • ${t.date} | ${t.type} | ${t.category} | ${t.amount}${t.description ? ` | ${t.description}` : ""}`).join("\n") || "  (none yet)"}

When asked to summarize revenue or results, give a 3-5 bullet summary with concrete numbers.
When asked how to improve capital or finances, give 3 specific, actionable suggestions grounded in their data.`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      messages: data.messages.map(m => ({ role: m.role, content: m.content })),
    });

    return { reply: text };
  });

/**
 * AI fallback extractor: when no rule-based parser matches but the email
 * looks financial, ask Lovable AI to extract structured transaction fields.
 * Server-only.
 */
import type { ParsedEmail, RawEmail } from "./email-parsers.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

const VALID_CATEGORIES = [
  "food", "transport", "utilities", "salary", "marketing",
  "software", "subscription", "inventory", "operations", "miscellaneous",
] as const;

function looksFinancial(e: RawEmail): boolean {
  const t = `${e.subject}\n${e.body}`.toLowerCase();
  return /(payment|paid|invoice|receipt|charged|debit|credit|transaction|order|subscription|renewed|amount|total|₦|ngn|usd|eur|gbp)/.test(
    t,
  );
}

function dateFromInternal(ms: string): string {
  return new Date(parseInt(ms, 10) || Date.now()).toISOString().slice(0, 10);
}

export async function aiExtract(e: RawEmail): Promise<ParsedEmail | null> {
  if (!looksFinancial(e)) return null;
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return null;

  const body = e.body.slice(0, 6000); // cap tokens
  const prompt = `Extract a single financial transaction from this email. If it is NOT a real money transaction (newsletter, promo, statement summary), return is_transaction=false.

From: ${e.from}
Subject: ${e.subject}
Body:
${body}`;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You extract structured transaction data from financial emails. Always call the extract_transaction tool.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_transaction",
              description: "Return structured transaction fields.",
              parameters: {
                type: "object",
                properties: {
                  is_transaction: { type: "boolean" },
                  amount: { type: "number" },
                  currency: { type: "string" },
                  type: { type: "string", enum: ["income", "expense"] },
                  merchant: { type: "string" },
                  reference: { type: "string" },
                  category: { type: "string", enum: [...VALID_CATEGORIES] },
                  confidence: { type: "number" },
                },
                required: ["is_transaction"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_transaction" } },
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return null;
    const parsed = JSON.parse(args) as {
      is_transaction: boolean;
      amount?: number;
      currency?: string;
      type?: "income" | "expense";
      merchant?: string;
      reference?: string;
      category?: string;
      confidence?: number;
    };
    if (!parsed.is_transaction || !parsed.amount || !parsed.type) return null;
    const category = (VALID_CATEGORIES as readonly string[]).includes(parsed.category ?? "")
      ? (parsed.category as string)
      : "miscellaneous";
    return {
      amount: Number(parsed.amount),
      currency: parsed.currency || "USD",
      type: parsed.type,
      merchant: parsed.merchant ?? null,
      reference: parsed.reference ?? null,
      date: dateFromInternal(e.internalDate),
      category,
      confidence: Math.min(0.7, Math.max(0.4, parsed.confidence ?? 0.55)),
      parserName: "ai_fallback",
    };
  } catch {
    return null;
  }
}

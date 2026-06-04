/**
 * Rule-based parsers for common Nigerian fintech / receipt emails.
 * Each parser returns null when the email doesn't match. Server-only.
 */

export type ParsedEmail = {
  amount: number;
  currency: string;
  type: "income" | "expense";
  merchant: string | null;
  reference: string | null;
  date: string; // YYYY-MM-DD
  category: string;
  confidence: number;
  parserName: string;
};

export type RawEmail = {
  from: string;
  subject: string;
  body: string; // plain text decoded
  internalDate: string; // ms epoch as string
};

const NUM = "[\\d,]+(?:\\.\\d{1,2})?";

function num(s: string | undefined | null): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function dateFromInternal(ms: string): string {
  const d = new Date(parseInt(ms, 10));
  return d.toISOString().slice(0, 10);
}

function guessCategory(merchant: string | null, subject: string, body: string): string {
  const t = `${merchant ?? ""} ${subject} ${body}`.toLowerCase();
  if (/(netflix|spotify|youtube premium|apple music|disney|hbo|prime video|showmax)/.test(t)) return "subscription";
  if (/(figma|notion|github|gitlab|aws|amazon web services|google workspace|microsoft 365|office 365|slack|zoom|linear|vercel|cloudflare|openai|anthropic|chatgpt|claude|cursor|jetbrains|adobe|canva)/.test(t)) return "software";
  if (/(facebook ads|meta ads|google ads|tiktok ads|linkedin ads|twitter ads|x ads|mailchimp|hubspot|brevo|sendgrid)/.test(t)) return "marketing";
  if (/(uber|bolt|indrive|taxi|transport|fuel|petrol)/.test(t)) return "transport";
  if (/(jumia|konga|amazon|shopify|store|mart|grocery|supermarket)/.test(t)) return "inventory";
  if (/(restaurant|food|chowdeck|jumia food|kfc|dominos|chicken|eat)/.test(t)) return "food";
  if (/(electric|ikedc|aedc|eko|nepa|water|airtime|data|mtn|airtel|glo|9mobile)/.test(t)) return "utilities";
  if (/(salary|payroll|wages)/.test(t)) return "salary";
  if (/(rent|office)/.test(t)) return "operations";
  return "miscellaneous";
}

// Paystack receipts / transfer alerts
function paystack(e: RawEmail): ParsedEmail | null {
  if (!/paystack/i.test(e.from) && !/paystack/i.test(e.subject)) return null;
  const amtMatch =
    e.body.match(new RegExp(`(?:NGN|₦|N)\\s?(${NUM})`, "i")) ||
    e.subject.match(new RegExp(`(?:NGN|₦|N)\\s?(${NUM})`, "i"));
  const amount = num(amtMatch?.[1]);
  if (!amount) return null;
  const type: "income" | "expense" =
    /received|credit|payout|incoming/i.test(`${e.subject} ${e.body}`) ? "income" : "expense";
  const merchantMatch = e.body.match(/(?:from|to|merchant)[:\s]+([A-Z0-9][A-Za-z0-9 &.'-]{2,40})/);
  const refMatch = e.body.match(/(?:reference|ref(?:erence)?\s*(?:id|no)?)[:\s]+([A-Za-z0-9_-]{4,})/i);
  const merchant = merchantMatch?.[1]?.trim() ?? "Paystack";
  return {
    amount,
    currency: "NGN",
    type,
    merchant,
    reference: refMatch?.[1] ?? null,
    date: dateFromInternal(e.internalDate),
    category: guessCategory(merchant, e.subject, e.body),
    confidence: 0.9,
    parserName: "paystack",
  };
}

// Flutterwave / Rave receipts
function flutterwave(e: RawEmail): ParsedEmail | null {
  if (!/(flutterwave|ravepay)/i.test(e.from) && !/flutterwave/i.test(e.subject)) return null;
  const amtMatch = e.body.match(new RegExp(`(?:NGN|₦|N|USD|\\$)\\s?(${NUM})`, "i"));
  const amount = num(amtMatch?.[1]);
  if (!amount) return null;
  const currency = /USD|\$/i.test(amtMatch?.[0] ?? "") ? "USD" : "NGN";
  const type: "income" | "expense" = /received|payout|settle/i.test(`${e.subject} ${e.body}`) ? "income" : "expense";
  const refMatch = e.body.match(/(?:reference|txref|tx_ref)[:\s]+([A-Za-z0-9_-]{4,})/i);
  const merchantMatch = e.body.match(/(?:merchant|customer|from|to)[:\s]+([A-Z0-9][A-Za-z0-9 &.'-]{2,40})/i);
  const merchant = merchantMatch?.[1]?.trim() ?? "Flutterwave";
  return {
    amount,
    currency,
    type,
    merchant,
    reference: refMatch?.[1] ?? null,
    date: dateFromInternal(e.internalDate),
    category: guessCategory(merchant, e.subject, e.body),
    confidence: 0.88,
    parserName: "flutterwave",
  };
}

// GTBank / generic Nigerian bank credit/debit alerts
function nigerianBank(e: RawEmail): ParsedEmail | null {
  const text = `${e.subject}\n${e.body}`;
  const isAlert =
    /(gtbank|gtco|access bank|zenith|uba|first bank|wema|opay|moniepoint|palmpay|kuda|sterling|fcmb|fidelity)/i.test(
      `${e.from} ${text}`,
    );
  if (!isAlert) return null;
  const debit = /\b(debit|withdraw|purchase|payment of)\b/i.test(text);
  const credit = /\b(credit|received|inflow|deposit)\b/i.test(text);
  if (!debit && !credit) return null;
  const amtMatch = text.match(new RegExp(`(?:NGN|₦|N)\\s?(${NUM})`, "i"));
  const amount = num(amtMatch?.[1]);
  if (!amount) return null;
  const refMatch = text.match(/(?:ref(?:erence)?(?:\s*no)?)[:\s]+([A-Za-z0-9_/-]{4,})/i);
  const merchantMatch =
    text.match(/(?:to|from|at|merchant|narration)[:\s]+([A-Z0-9][A-Za-z0-9 &.'/-]{2,60})/) || null;
  const merchant = merchantMatch?.[1]?.trim() ?? "Bank alert";
  return {
    amount,
    currency: "NGN",
    type: debit ? "expense" : "income",
    merchant,
    reference: refMatch?.[1] ?? null,
    date: dateFromInternal(e.internalDate),
    category: guessCategory(merchant, e.subject, e.body),
    confidence: 0.82,
    parserName: "ng_bank",
  };
}

// Generic receipt / invoice
function genericReceipt(e: RawEmail): ParsedEmail | null {
  const text = `${e.subject}\n${e.body}`;
  if (!/(receipt|invoice|order|payment|charged|subscription)/i.test(text)) return null;
  const amtMatch = text.match(new RegExp(`(?:USD|\\$|EUR|€|GBP|£|NGN|₦)\\s?(${NUM})`, "i"));
  const amount = num(amtMatch?.[1]);
  if (!amount) return null;
  const sym = amtMatch?.[0] ?? "";
  let currency = "USD";
  if (/€|EUR/.test(sym)) currency = "EUR";
  else if (/£|GBP/.test(sym)) currency = "GBP";
  else if (/₦|NGN/.test(sym)) currency = "NGN";
  const merchantMatch = e.from.match(/"?([^"<]+?)"?\s*</) || [null, e.from.split("@")[0]];
  const merchant = merchantMatch[1]?.trim() ?? null;
  return {
    amount,
    currency,
    type: "expense",
    merchant,
    reference: null,
    date: dateFromInternal(e.internalDate),
    category: guessCategory(merchant, e.subject, e.body),
    confidence: 0.65,
    parserName: "generic_receipt",
  };
}

const PARSERS = [paystack, flutterwave, nigerianBank, genericReceipt];

export function parseEmail(e: RawEmail): ParsedEmail | null {
  for (const p of PARSERS) {
    try {
      const result = p(e);
      if (result) return result;
    } catch {
      // ignore parser errors
    }
  }
  return null;
}

/** Decode a Gmail base64url payload to UTF-8 text. */
export function decodeBase64Url(data: string): string {
  const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

/** Walk Gmail payload parts, return concatenated text/plain (fallback text/html stripped). */
export function extractBody(payload: any): string {
  if (!payload) return "";
  const collect = (p: any, out: { plain: string[]; html: string[] }) => {
    if (!p) return;
    if (p.mimeType === "text/plain" && p.body?.data) out.plain.push(decodeBase64Url(p.body.data));
    else if (p.mimeType === "text/html" && p.body?.data) out.html.push(decodeBase64Url(p.body.data));
    if (Array.isArray(p.parts)) p.parts.forEach((sub: any) => collect(sub, out));
  };
  const out = { plain: [] as string[], html: [] as string[] };
  collect(payload, out);
  if (out.plain.length) return out.plain.join("\n");
  if (out.html.length) {
    return out.html
      .join("\n")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  }
  return "";
}
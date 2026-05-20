export function formatCurrency(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatCurrencyParts(amount: number, currency = "USD", locale = "en-US") {
  try {
    const nf = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 });
    const parts = nf.formatToParts(amount);
    const currencyPart = parts.filter((p) => p.type === "currency").map((p) => p.value).join("");
    const numberPart = parts.filter((p) => p.type !== "currency").map((p) => p.value).join("");
    return { number: numberPart, currency: currencyPart };
  } catch {
    return { number: amount.toFixed(2), currency };
  }
}

export function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

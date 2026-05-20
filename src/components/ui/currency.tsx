import React from "react";
import { formatCurrencyParts } from "@/lib/format";

export function Currency({ amount, currency, className }: { amount: number; currency: string; className?: string }) {
  const parts = formatCurrencyParts(amount, currency);
  return (
    <span className={className ? className : "inline-flex items-baseline gap-2"}>
      <span>{parts.number}</span>
      <span className="text-sm text-muted-foreground">{parts.currency}</span>
    </span>
  );
}

export default Currency;

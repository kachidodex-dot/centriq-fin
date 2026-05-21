import { type Transaction } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import Currency from "@/components/ui/currency";
import { cn } from "@/lib/utils";

export function TransactionTable({ txs, currency, onEdit, onDelete }: { txs: Transaction[]; currency: string; onEdit: (t: Transaction) => void; onDelete: (t: Transaction) => void; }) {
  if (txs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="text-sm font-medium">No transactions yet</div>
        <p className="mt-1 text-xs text-muted-foreground">Add your first income or expense to get started.</p>
      </div>
    );
  }
  return (
    <div className="glow-card rounded-2xl overflow-hidden shadow-soft">
      <div className="md:hidden p-4 space-y-3">
        {txs.map((t) => (
          <div key={t.id} className="rounded-lg border border-border/60 bg-card/30 p-3 flex items-start justify-between">
            <div className="min-w-0">
              <div className="text-sm font-medium">{formatDate(t.date)}</div>
              <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{t.category}</Badge>
                <span className="truncate max-w-[160px]">{t.note || "—"}</span>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className={cn("font-medium tabular-nums", t.type === "income" ? "text-success" : "text-foreground")}>
                {t.type === "income" ? "+" : "−"} <Currency amount={Number(t.amount)} currency={currency} />
              </div>
              <div className="mt-2 inline-flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(t)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-t border-border/60 transition-colors hover:bg-primary/5">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-3"><Badge variant="secondary" className="capitalize">{t.category}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{t.note || "—"}</td>
                <td className={cn("px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap", t.type === "income" ? "text-success" : "text-foreground")}>
                  {t.type === "income" ? "+" : "−"} <Currency amount={Number(t.amount)} currency={currency} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(t)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

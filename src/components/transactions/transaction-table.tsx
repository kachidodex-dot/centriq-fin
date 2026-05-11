import { type Transaction } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
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
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
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
              <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-3"><Badge variant="secondary" className="capitalize">{t.category}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{t.note || "—"}</td>
                <td className={cn("px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap", t.type === "income" ? "text-success" : "text-foreground")}>
                  {t.type === "income" ? "+" : "−"} {formatCurrency(Number(t.amount), currency)}
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

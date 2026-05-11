import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Transaction, type TxCategory, type TxType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function TransactionForm({ open, onOpenChange, onSaved, editing }: { open: boolean; onOpenChange: (o: boolean) => void; onSaved: () => void; editing?: Transaction | null }) {
  const { user } = useAuth();
  const [type, setType] = useState<TxType>("expense");
  const [category, setCategory] = useState<TxCategory>("miscellaneous");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setType(editing.type); setCategory(editing.category);
      setAmount(String(editing.amount)); setNote(editing.note ?? "");
      setDate(editing.date);
    } else {
      setType("expense"); setCategory("miscellaneous");
      setAmount(""); setNote(""); setDate(new Date().toISOString().slice(0, 10));
    }
  }, [editing, open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    const payload = { type, category, amount: amt, note: note || null, date, user_id: user.id };
    const { error } = editing
      ? await supabase.from("transactions").update(payload).eq("id", editing.id)
      : await supabase.from("transactions").insert(payload);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Transaction updated" : "Transaction added");
    onSaved(); onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editing ? "Edit transaction" : "Add transaction"}</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={type === "income" ? "default" : "outline"} onClick={() => setType("income")}>Income</Button>
            <Button type="button" variant={type === "expense" ? "default" : "outline"} onClick={() => setType("expense")}>Expense</Button>
          </div>
          <div className="space-y-2"><Label>Amount</Label><Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required /></div>
          <div className="space-y-2"><Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TxCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Note (optional)</Label><Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Add a quick note" /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

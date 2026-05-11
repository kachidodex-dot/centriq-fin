export type TxType = "income" | "expense";
export type TxCategory = "inventory" | "food" | "transport" | "utilities" | "salary" | "miscellaneous";

export interface Transaction {
  id: string;
  user_id: string;
  type: TxType;
  category: TxCategory;
  amount: number;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES: { value: TxCategory; label: string }[] = [
  { value: "inventory", label: "Inventory" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "salary", label: "Salary" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

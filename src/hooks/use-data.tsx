import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from "@/lib/types";
import { useAuth } from "./use-auth";

export function useTransactions() {
  const { user } = useAuth();
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false }).order("created_at", { ascending: false });
    if (!error && data) setData(data as Transaction[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export type Profile = { id: string; business_name: string | null; currency: string; theme: string; notifications_enabled: boolean; role: "admin" | "user" | null };

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);
  return { profile, loading, refetch };
}

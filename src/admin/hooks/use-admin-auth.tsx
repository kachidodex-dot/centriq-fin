import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth(redirectOnFail = true) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (mounted && redirectOnFail) navigate({ to: "/admin/login" });
        if (mounted) setChecking(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      const ok = !!data && !error;
      if (!mounted) return;
      setIsAdmin(ok);
      setChecking(false);
      if (!ok && redirectOnFail) {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
      }
    })();
    return () => { mounted = false; };
  }, [navigate, redirectOnFail]);

  return { checking, isAdmin };
}
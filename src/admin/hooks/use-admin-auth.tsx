import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function useAdminAuth(redirectOnFail = true) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user || !isAdmin) {
      if (redirectOnFail) {
        if (user) {
          void signOut();
        }
        toast.error("Unauthorized Access");
        navigate({ to: "/admin/login" });
      }
      setChecking(false);
      return;
    }

    setChecking(false);
  }, [user, isAdmin, loading, navigate, redirectOnFail, signOut]);

  return { checking, isAdmin };
}
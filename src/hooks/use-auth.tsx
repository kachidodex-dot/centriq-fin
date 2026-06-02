import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getPrimaryRole, type AppRole } from "@/integrations/supabase/auth";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role: AppRole | null }>;
  signUp: (email: string, password: string, businessName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setRole(null);
      return;
    }

    try {
      setRole(await getPrimaryRole(userId));
    } catch (error) {
      console.error("Unable to resolve user role:", error);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      fetchRole(s?.user?.id);
    });

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      await fetchRole(s?.user?.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    let signedInRole: AppRole | null = null;

    if (data?.session?.user?.id) {
      signedInRole = await getPrimaryRole(data.session.user.id);
      setRole(signedInRole);
    }

    return { error, role: signedInRole };
  };

  const signUp = async (email: string, password: string, businessName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { business_name: businessName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        role,
        isAdmin: role === "admin",
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

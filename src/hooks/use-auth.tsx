import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getPrimaryRole, type AppRole } from "@/integrations/supabase/auth";
import { isRateLimited, recordFailedAttempt, clearRateLimit, isValidEmail } from "@/lib/security";

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

/**
 * Provides authentication context and methods for the entire application.
 * Handles user session management, role-based access, and auth state.
 */
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

  /**
   * Sign in with email and password
   * Includes rate limiting and email validation
   */
  const signIn = async (email: string, password: string) => {
    // Validate email format
    if (!isValidEmail(email)) {
      return { error: new Error("Please enter a valid email address"), role: null };
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return {
        error: new Error("Too many failed sign-in attempts. Please try again in 30 minutes."),
        role: null,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    let signedInRole: AppRole | null = null;

    if (error) {
      recordFailedAttempt(email);
      return { error, role: null };
    }

    if (data?.session?.user?.id) {
      try {
        signedInRole = await getPrimaryRole(data.session.user.id);
        setRole(signedInRole);
        clearRateLimit(email); // Clear rate limit on successful login
      } catch (roleError) {
        console.error("Failed to fetch role:", roleError);
      }
    }

    return { error: null, role: signedInRole };
  };

  /**
   * Create a new account with email, password, and business name
   * Includes rate limiting and email validation
   */
  const signUp = async (email: string, password: string, businessName: string) => {
    // Validate email format
    if (!isValidEmail(email)) {
      return { error: new Error("Please enter a valid email address") };
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return { error: new Error("Too many sign-up attempts. Please try again in 30 minutes.") };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { business_name: businessName },
      },
    });

    if (error) {
      recordFailedAttempt(email);
    }

    return { error };
  };

  /**
   * Sign out current user and clear auth state
   */
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

/**
 * Hook to access authentication context throughout the application.
 * Must be used within an AuthProvider component.
 *
 * @returns Authentication context with user, session, role, and auth methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const { user, isAdmin, signIn, signOut } = useAuth();
 *
 * if (!user) return <LoginPage />;
 * if (isAdmin) return <AdminDashboard />;
 * ```
 */
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

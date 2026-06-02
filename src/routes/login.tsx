import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import logo from "@/assets/ryport-logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Ryport" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    }
  }, [user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, role } = await signIn(email, password);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-center justify-center gradient-primary p-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="relative z-10 max-w-md text-primary-foreground">
          <Link to="/" className="flex items-center gap-3 font-semibold group">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary-foreground/30 blur-xl animate-pulse-glow" />
              <img src={logo} alt="Ryport" className="relative h-14 w-14 rounded-full object-contain shadow-2xl ring-2 ring-primary-foreground/30 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110" />
            </div>
            <span className="text-2xl tracking-tight">Ryport</span>
          </Link>
          <h2 className="mt-12 text-4xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">Welcome back to financial clarity.</h2>
          <p className="mt-4 text-primary-foreground/80 animate-in fade-in slide-in-from-bottom-6 duration-1000">Sign in to see today's numbers and what AI noticed about your business.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-semibold mb-8"><img src={logo} alt="Ryport" className="h-10 w-10 rounded-full object-contain" /> Ryport</Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back. Let's check the numbers.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">Don't have an account? <Link to="/signup" className="text-foreground font-medium hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

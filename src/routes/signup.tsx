import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Zentriq" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await signUp(email, password, businessName || "My Business");
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — welcome to Zentriq");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative items-center justify-center gradient-primary p-12 overflow-hidden">
        <div className="relative z-10 max-w-md text-primary-foreground">
          <Link to="/" className="flex items-center gap-2 font-semibold"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-foreground/15 backdrop-blur">Z</div> Zentriq</Link>
          <h2 className="mt-12 text-4xl font-bold leading-tight">Start running your business with clarity.</h2>
          <p className="mt-4 text-primary-foreground/80">Free to start. Set up in under a minute.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-semibold mb-8"><div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground">Z</div> Zentriq</Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get AI-powered financial insights in seconds.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2"><Label htmlFor="biz">Business name</Label><Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Co." /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating…" : "Create account"}</Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

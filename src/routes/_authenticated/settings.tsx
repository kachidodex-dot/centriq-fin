import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/use-data";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Zentriq" }] }),
  component: SettingsPage,
});

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "KES", "INR", "JPY", "CAD", "AUD"];

function SettingsPage() {
  const { profile, refetch } = useProfile();
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setBusinessName(profile.business_name || "");
    setCurrency(profile.currency);
    setTheme(profile.theme);
    setNotifications(profile.notifications_enabled);
  }, [profile]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      business_name: businessName || null, currency, theme, notifications_enabled: notifications,
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    refetch();
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your business and preferences.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
        <div className="space-y-2"><Label>Business name</Label><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Co." /></div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h2 className="font-semibold">Preferences</h2>
        <div className="space-y-2"><Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div><div className="text-sm font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Lower contrast for late-night work</div></div>
          <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div><div className="text-sm font-medium">Email notifications</div><div className="text-xs text-muted-foreground">Weekly summary of your finances</div></div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </section>

      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
    </div>
  );
}

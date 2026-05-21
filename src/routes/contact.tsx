import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MessageSquare, Clock, Check, Loader2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zentriq" },
      { name: "description", content: "Talk to the Zentriq team. Sales, support, partnerships — we typically reply within one business day." },
      { property: "og:title", content: "Contact — Zentriq" },
      { property: "og:description", content: "Get in touch with the Zentriq team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

const faqs = [
  { q: "How quickly will I hear back?", a: "Most messages get a personal reply within one business day. Urgent support issues are usually answered the same day." },
  { q: "Do you offer onboarding help?", a: "Yes. Every new account gets free onboarding guidance from our team — just mention it in your message." },
  { q: "Can I migrate from another tool?", a: "We support CSV imports from most accounting platforms and can help map categories during onboarding." },
  { q: "Is Zentriq right for my business?", a: "Zentriq is built for small businesses, agencies, retail, and online operators. Tell us about yours and we'll be honest." },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("loading");
    await new Promise((r) => setTimeout(r, 900));
    setState("success");
  };

  return (
    <MarketingShell>
      <PageHero
        eyebrow="We'd love to hear from you"
        title="Talk to the Zentriq team."
        subtitle="Sales, support, partnerships, or just a thoughtful question — drop us a line and a real person will reply."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-soft">
            {state === "success" ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-success/15 text-success grid place-items-center">
                  <Check className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight">Message received.</h2>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">Thanks for reaching out. A member of the Zentriq team will get back to you within one business day.</p>
                <Button variant="outline" className="mt-8 rounded-full" onClick={() => { setForm({ name: "", email: "", company: "", message: "" }); setState("idle"); }}>Send another message</Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 h-11" placeholder="Jane Cooper" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 h-11" placeholder="jane@company.com" />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-1.5 h-11" placeholder="Acme Inc." />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5 min-h-[140px]" placeholder="Tell us a bit about what you're working on…" />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" disabled={state === "loading"} className="rounded-full px-6 h-11 gap-2">
                  {state === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send message"}
                </Button>
                <p className="text-xs text-muted-foreground">By submitting, you agree to our terms and privacy policy.</p>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Mail className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">Email support</div>
              <p className="mt-1 text-sm text-muted-foreground">For any product, billing, or account question.</p>
              <a href="mailto:hello@zentriq.com" className="mt-3 inline-block text-sm font-medium underline">hello@zentriq.com</a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">Sales & partnerships</div>
              <p className="mt-1 text-sm text-muted-foreground">Talk to our team about scaled deployments or partnerships.</p>
              <a href="mailto:sales@zentriq.com" className="mt-3 inline-block text-sm font-medium underline">sales@zentriq.com</a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Clock className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">Response time</div>
              <p className="mt-1 text-sm text-muted-foreground">Average reply within <span className="text-foreground font-medium">4 business hours</span>. Monday–Friday, global team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="text-center mb-10">
          <HelpCircle className="mx-auto h-6 w-6 text-primary" />
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Quick answers</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="text-sm font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
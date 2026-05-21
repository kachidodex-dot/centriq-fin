import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote, TrendingUp, Users, DollarSign, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Zentriq" },
      { name: "description", content: "How modern businesses use Zentriq to understand cashflow, plan growth, and operate with confidence." },
      { property: "og:title", content: "Customers — Zentriq" },
      { property: "og:description", content: "Real businesses, real results. See how Zentriq powers modern finance teams." },
    ],
  }),
  component: CustomersPage,
});

const logos = ["Northwind", "Lumen Studio", "Atlas Goods", "Parallel", "Hearth & Co.", "Modular Labs", "Quiet Capital", "Bloom Health"];

const stats = [
  { value: "1,200+", label: "Businesses on Zentriq" },
  { value: "$840M", label: "Tracked annually" },
  { value: "37%", label: "Avg. time saved on finance ops" },
  { value: "4.9 / 5", label: "Customer rating" },
];

const stories = [
  {
    company: "Northwind Coffee Roasters",
    industry: "Specialty retail · 14 locations",
    growth: "+42% revenue · 12 months",
    quote: "Zentriq replaced three spreadsheets and a weekly meeting. We finally know our margins per location, in real time.",
    person: "Mara Chen, Co-founder",
  },
  {
    company: "Lumen Studio",
    industry: "Design agency · 28 people",
    growth: "+31% net profit · 9 months",
    quote: "The AI assistant flagged a payment processor leak we'd been paying for eighteen months. It paid for itself the first week.",
    person: "Daniel Okafor, Operations Lead",
  },
  {
    company: "Atlas Goods",
    industry: "DTC commerce · $6M ARR",
    growth: "2.1× cash runway",
    quote: "Forecasting used to take a full day. Now I open Zentriq, scan the dashboard, and ship the rest of my Monday.",
    person: "Priya Shah, Founder",
  },
];

const testimonials = [
  { quote: "It feels like a CFO that never sleeps.", name: "Sam Whitfield", role: "Founder, Hearth & Co." },
  { quote: "Beautiful product, ruthless utility. Rare combo.", name: "Aiko Tanaka", role: "COO, Parallel" },
  { quote: "Our investors actually enjoy the monthly export now.", name: "Marcus Reed", role: "CEO, Modular Labs" },
  { quote: "Replaced our bookkeeper's monthly report in a week.", name: "Elena Rossi", role: "Founder, Bloom Health" },
];

function CustomersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Trusted by modern businesses"
        title="The operating system behind 1,200+ growing companies."
        subtitle="From boutique studios to multi-location retailers, founders use Zentriq to see their numbers clearly and make better decisions, faster."
      />

      {/* Logos */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-b border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center opacity-70">
          {logos.map((l) => (
            <div key={l} className="text-center text-sm font-semibold tracking-tight text-muted-foreground">{l}</div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">Customer stories</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Real businesses. Real numbers.</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {stories.map((s) => (
            <article key={s.company} className="group rounded-2xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-primary/20 via-chart-2/15 to-muted relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5 text-success" /> {s.growth}
                </div>
              </div>
              <div className="text-sm font-semibold">{s.company}</div>
              <div className="text-xs text-muted-foreground">{s.industry}</div>
              <Quote className="mt-5 h-5 w-5 text-primary/60" />
              <p className="mt-2 text-[15px] leading-relaxed">{s.quote}</p>
              <div className="mt-5 text-xs text-muted-foreground">— {s.person}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials wall */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Loved by operators</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="text-[15px] leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 text-xs">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-primary" />
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Join the businesses growing on Zentriq.</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Free to start. No credit card. Set up in under a minute.</p>
        <Link to="/signup"><Button size="lg" className="mt-8 rounded-full px-7 gap-2">Get started free <ArrowRight className="h-4 w-4" /></Button></Link>
      </section>
    </MarketingShell>
  );
}
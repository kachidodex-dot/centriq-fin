import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, BarChart3, Brain, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zentriq — AI-powered financial intelligence" },
      { name: "description", content: "Track money, understand cash flow, and get AI-powered insights for your small business." },
      { property: "og:title", content: "Zentriq — AI-powered financial intelligence" },
      { property: "og:description", content: "A modern AI financial operating system for small businesses." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground font-bold">Z</div>
          <span className="font-semibold tracking-tight">Zentriq</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#dashboard" className="hover:text-foreground transition">Dashboard</a>
          <a href="#ai" className="hover:text-foreground transition">AI Insights</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI insights now in early access
        </div>
        <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          AI-powered financial<br />
          <span className="text-gradient">intelligence for modern businesses.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Track every dollar, surface real insights, and run your business with the clarity finance teams expect — without hiring one.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/signup"><Button size="lg" className="gap-2">Get started <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Try Zentriq</Button></Link>
        </div>
        <div className="mt-20 mx-auto max-w-5xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-elevated p-3 sm:p-4">
      <div className="rounded-xl bg-background overflow-hidden border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          </div>
          <div className="ml-3 text-xs text-muted-foreground">app.zentriq.io / dashboard</div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {[
            { label: "Income", value: "$48,200", trend: "+12%" },
            { label: "Expenses", value: "$21,540", trend: "-3%" },
            { label: "Net Profit", value: "$26,660", trend: "+18%" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-left shadow-soft">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold">{s.value}</div>
              <div className="mt-1 text-xs text-success">{s.trend} vs last month</div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <div className="h-32 w-full rounded-lg gradient-primary opacity-90 [mask-image:linear-gradient(180deg,#000,transparent)]" />
        </div>
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { icon: BarChart3, title: "Real-time dashboard", body: "See income, expenses, and profit at a glance with charts that actually mean something." },
    { icon: Brain, title: "AI insights", body: "Get plain-English summaries explaining why your numbers moved this week." },
    { icon: TrendingUp, title: "Health score", body: "A single number that tells you how your business is doing financially." },
    { icon: Zap, title: "Fast capture", body: "Log income and expenses in seconds. No accounting jargon. No spreadsheets." },
    { icon: ShieldCheck, title: "Bank-grade security", body: "Your data is encrypted at rest and in transit. Only you can see it." },
    { icon: Sparkles, title: "Built for founders", body: "Designed for small business owners who want clarity, not complexity." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to run the numbers</h2>
        <p className="mt-3 text-muted-foreground">Modern tools without the enterprise overhead.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated transition">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiSection() {
  return (
    <section id="ai" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs"><Brain className="h-3.5 w-3.5 text-primary" /> AI Insights</div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Your numbers, explained.</h2>
          <p className="mt-3 text-muted-foreground">Zentriq watches your transactions and tells you what matters — in clear, human language.</p>
        </div>
        <div className="space-y-3">
          {[
            "Transport spending increased 22% this week.",
            "You're saving 38% of monthly income — above industry average.",
            "Food has overtaken inventory as your top expense category.",
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-border gradient-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md gradient-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
                <p className="text-sm">{t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="rounded-3xl border border-border gradient-card p-12 text-center shadow-elevated">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Run your business with clarity.</h2>
        <p className="mt-3 text-muted-foreground">Start free. No credit card. Set up in under a minute.</p>
        <Link to="/signup"><Button size="lg" className="mt-8 gap-2">Get started <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="grid h-6 w-6 place-items-center rounded-md gradient-primary text-primary-foreground text-xs font-bold">Z</div>
          © {new Date().getFullYear()} Zentriq
        </div>
        <div className="text-xs text-muted-foreground">Built for founders. Designed for clarity.</div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <section id="dashboard" className="sr-only">Dashboard preview shown above</section>
        <Features />
        <AiSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

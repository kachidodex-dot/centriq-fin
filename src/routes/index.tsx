import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, BarChart3, Brain, ShieldCheck, TrendingUp, Zap, Check, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/zentriq-logo.jpeg";
import { useEffect, useState } from "react";
import { Reveal, StaggerContainer, StaggerItem, FloatY } from "@/components/motion/reveal";

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

function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={logo} alt="Zentriq" className={`${className} rounded-full object-contain shadow-soft`} />;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-soft" : "bg-transparent"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-all duration-500 ${scrolled ? "opacity-0 scale-90" : "opacity-100 scale-100 animate-pulse-glow"}`} />
            <Logo className={`relative transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 ${scrolled ? "h-10 w-10" : "h-14 w-14 ring-2 ring-primary/20"}`} />
          </div>
          <span className={`font-bold tracking-tight transition-all duration-500 ${scrolled ? "text-lg" : "text-2xl"}`}>Zentriq</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stats" className="hover:text-foreground transition">Why Zentriq</a>
          <a href="#testimonial" className="hover:text-foreground transition">Customers</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm" className="rounded-full px-4">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 sm:pt-24 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <StaggerContainer once amount={0.1} stagger={0.12}>
            <StaggerItem>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Trusted by 1,200+ small businesses
            </div>
            </StaggerItem>
            <StaggerItem>
            <h1 className="mt-6 text-balance text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Track your revenue. <span className="text-muted-foreground">Grow your business.</span>
            </h1>
            </StaggerItem>
            <StaggerItem>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Easily track income, monitor cash flow, and stay on top of your revenue without the complexity of traditional accounting tools.
            </p>
            </StaggerItem>
            <StaggerItem>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup"><Button size="lg" className="gap-2 rounded-full px-6 transition-transform hover:scale-[1.02]">Try it for free <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="rounded-full px-6 transition-transform hover:scale-[1.02]">Learn more</Button></Link>
            </div>
            </StaggerItem>
            <StaggerItem>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-success text-success" />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Trustpilot</span> · 4.9/5 from 320+ reviews
              </div>
            </div>
            </StaggerItem>
          </StaggerContainer>
          <Reveal direction="left" duration={0.6} className="relative">
            <FloatY amplitude={6} duration={9}>
              <DashboardPreview />
            </FloatY>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 gradient-primary opacity-10 blur-3xl rounded-full" />
      <div className="relative rounded-2xl border border-border bg-card shadow-elevated p-2.5">
        <div className="rounded-xl bg-background overflow-hidden border border-border">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/40" />
            </div>
            <div className="ml-3 text-[11px] text-muted-foreground">app.zentriq.io / dashboard</div>
          </div>
          <div className="p-5">
            <div className="text-sm font-medium">Good morning, Ryan</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Revenue", value: "$52,820", trend: "+12%" },
                { label: "New users", value: "2,780", trend: "+8%" },
                { label: "Projects", value: "18", trend: "+2" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-base font-semibold">{s.value}</div>
                  <div className="mt-0.5 inline-flex items-center rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">{s.trend}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">Earnings</span>
                <span>This month</span>
              </div>
              <div className="mt-3 flex items-end gap-1.5 h-24">
                {[40, 60, 35, 75, 55, 85, 65, 95, 70, 80, 60, 90, 75, 100, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t gradient-primary opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { value: "1.2M+", label: "Transactions tracked", body: "Helping users stay on top of every dollar." },
    { value: "$85M+", label: "Managed assets", body: "Total funds tracked across all accounts." },
    { value: "92%", label: "Users feel in control", body: "Report better financial clarity within 30 days." },
  ];
  return (
    <section id="stats" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal direction="up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Real savings, real results</h2>
          <p className="mt-4 text-muted-foreground">From everyday expenses to growth investments — Zentriq helps you understand every move without the hassle.</p>
        </Reveal>
        <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-3" stagger={0.12}>
          {items.map((s, i) => (
            <StaggerItem key={s.label} direction="up">
              <div className={`rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${i === 1 ? "sm:-translate-y-4" : ""}`}>
                <div className="text-5xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.12em] font-semibold text-muted-foreground">{s.label}</div>
                <p className="mt-4 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section id="testimonial" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal direction="right" className="relative aspect-[4/5] max-w-md rounded-3xl bg-gradient-to-br from-accent to-secondary overflow-hidden shadow-elevated">
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <div className="ml-1 h-0 w-0 border-y-8 border-y-transparent border-l-[12px] border-l-primary-foreground" />
            </div>
          </div>
        </Reveal>
        <Reveal direction="left">
          <Quote className="h-10 w-10 text-primary" />
          <blockquote className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
            "I finally know where my money is going."
          </blockquote>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            I used to guess my spending. Now I see everything clearly and save more every month.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Within weeks, I found leaks in my spending I didn't even realize.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 font-semibold text-primary">MC</div>
            <div>
              <div className="font-semibold">Maya Chen</div>
              <div className="text-sm text-muted-foreground">Founder, Bloom Studio</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
      <Reveal direction="up" className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"><Sparkles className="h-3 w-3 text-primary" /> Features</div>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Everything you need to run the numbers</h2>
        <p className="mt-4 text-muted-foreground">Modern tools without the enterprise overhead.</p>
      </Reveal>
      <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {items.map((f) => (
          <StaggerItem key={f.title}>
            <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function AiSection() {
  return (
    <section id="ai" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal direction="right">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs"><Brain className="h-3.5 w-3.5 text-primary" /> AI Insights</div>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Your numbers, explained.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Zentriq watches your transactions and tells you what matters — in clear, human language. No spreadsheets, no jargon.</p>
            <ul className="mt-6 space-y-3">
              {["Plain-English summaries every week", "Spot anomalies before they become problems", "Personalized growth recommendations"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <StaggerContainer className="space-y-3" stagger={0.1}>
            {[
              "Transport spending increased 22% this week.",
              "You're saving 38% of monthly income — above industry average.",
              "Food has overtaken inventory as your top expense category.",
            ].map((t, i) => (
              <StaggerItem key={i} direction="left">
                <div className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:translate-x-1 hover:shadow-elevated">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></div>
                    <p className="text-sm leading-relaxed">{t}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal direction="up" className="relative rounded-3xl border border-border bg-card p-12 sm:p-16 text-center shadow-elevated overflow-hidden">
        <div aria-hidden className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
        <div className="relative">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Run your business with clarity.</h2>
          <p className="mt-4 text-muted-foreground">Start free. No credit card. Set up in under a minute.</p>
          <Link to="/signup"><Button size="lg" className="mt-8 gap-2 rounded-full px-7 transition-transform hover:scale-[1.02]">Get started free <ArrowRight className="h-4 w-4" /></Button></Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Free forever plan</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Bank-grade security</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Cancel anytime</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <Reveal direction="up" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-semibold">Zentriq</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">A modern AI financial operating system for small businesses.</p>
          </div>
          {([
            { title: "Product", links: [{ label: "Features", to: "/" }, { label: "Dashboard", to: "/dashboard" }, { label: "Pricing", to: "/" }, { label: "Security", to: "/" }] },
            { title: "Company", links: [{ label: "About", to: "/" }, { label: "Blog", to: "/blog" }, { label: "Customers", to: "/customers" }, { label: "Contact", to: "/contact" }] },
            { title: "Legal", links: [{ label: "Privacy", to: "/privacy" }, { label: "Terms", to: "/terms" }, { label: "Cookies", to: "/cookies" }] },
          ] as const).map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold">{c.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {c.links.map((l) => <li key={l.label}><Link to={l.to} className="hover:text-foreground transition">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Zentriq. All rights reserved.</div>
          <div className="text-xs text-muted-foreground">Built for founders. Designed for clarity.</div>
        </div>
      </Reveal>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Testimonial />
        <Features />
        <AiSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

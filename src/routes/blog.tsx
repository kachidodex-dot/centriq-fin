import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Zentriq" },
      { name: "description", content: "Insights on AI, cashflow, and modern finance for founders and operators." },
      { property: "og:title", content: "Blog — Zentriq" },
      { property: "og:description", content: "Insights on AI, cashflow, and modern finance for founders and operators." },
    ],
  }),
  component: BlogPage,
});

const categories = ["All", "AI", "Cashflow", "Growth", "Accounting", "Playbooks"];

const featured = {
  category: "AI",
  title: "Improving cashflow with AI: a practical guide for founders",
  excerpt: "How modern AI models surface revenue patterns, expense leaks, and runway risk before they hit your bank account.",
  author: "The Zentriq Team",
  date: "May 12, 2026",
  readTime: "8 min read",
};

const posts = [
  { category: "Growth", title: "Five financial habits that separate growing startups from stalled ones", excerpt: "The compounding effect of weekly financial reviews, and how to build the habit without it feeling like accounting homework.", date: "May 6, 2026", readTime: "6 min" },
  { category: "Accounting", title: "Understanding business profitability beyond the bank balance", excerpt: "Net profit, gross margin, contribution margin — what they really mean and which numbers should actually drive decisions.", date: "Apr 28, 2026", readTime: "7 min" },
  { category: "AI", title: "AI-powered accounting: where it works today and where it doesn't", excerpt: "A grounded look at the workflows AI is genuinely automating in 2026 — and the ones that still need a human in the loop.", date: "Apr 22, 2026", readTime: "9 min" },
  { category: "Playbooks", title: "Smart financial planning for the next twelve months", excerpt: "A simple, repeatable framework for forecasting revenue, expenses, and hiring without spreadsheets that break every quarter.", date: "Apr 14, 2026", readTime: "10 min" },
  { category: "Cashflow", title: "The 30-day cash runway audit every founder should run", excerpt: "A checklist to pressure-test your runway assumptions and catch the silent expenses that erode margin.", date: "Apr 2, 2026", readTime: "5 min" },
  { category: "Growth", title: "Pricing changes that actually move the needle (without losing customers)", excerpt: "How to model, communicate, and ship a pricing update with confidence — backed by your own transaction data.", date: "Mar 24, 2026", readTime: "8 min" },
];

function BlogPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Zentriq Journal"
        title="Ideas for building a financially intelligent business."
        subtitle="Tactical writing on cashflow, AI, and modern finance — from the team building Zentriq and the operators using it."
      />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c, i) => (
            <button key={c} className={`rounded-full border px-4 py-1.5 text-sm transition ${i === 0 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto bg-gradient-to-br from-primary/30 via-chart-2/20 to-background">
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Featured
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-primary">{featured.category}</div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{featured.title}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{featured.author}</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
              </div>
              <Button className="mt-8 w-fit rounded-full gap-2">Read article <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </article>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-primary/15 via-chart-2/10 to-muted mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
              </div>
              <div className="text-xs uppercase tracking-widest text-primary">{p.category}</div>
              <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary transition">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 sm:p-14 text-center shadow-soft">
          <div className="absolute inset-0 gradient-hero pointer-events-none opacity-60" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Get the Zentriq newsletter</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">One thoughtful email a month on cashflow, AI, and the financial habits behind durable companies.</p>
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="you@company.com" className="h-11 rounded-full px-5" />
              <Button type="submit" className="h-11 rounded-full px-6">Subscribe</Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">No spam. Unsubscribe in one click.</p>
            <div className="mt-6 text-xs text-muted-foreground">
              Looking for the product? <Link to="/" className="text-foreground underline">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
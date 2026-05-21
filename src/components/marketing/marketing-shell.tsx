import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/zentriq-logo.jpeg";

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
          <Logo className={`transition-all duration-500 ${scrolled ? "h-10 w-10" : "h-12 w-12 ring-2 ring-primary/20"}`} />
          <span className={`font-bold tracking-tight transition-all duration-500 ${scrolled ? "text-lg" : "text-xl"}`}>Zentriq</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/blog" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Blog</Link>
          <Link to="/customers" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Customers</Link>
          <Link to="/contact" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm" className="rounded-full px-4">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const groups = [
    { title: "Product", links: [{ label: "Features", to: "/" }, { label: "Dashboard", to: "/dashboard" }, { label: "Pricing", to: "/" }, { label: "Security", to: "/" }] },
    { title: "Company", links: [{ label: "About", to: "/" }, { label: "Blog", to: "/blog" }, { label: "Customers", to: "/customers" }, { label: "Contact", to: "/contact" }] },
    { title: "Legal", links: [{ label: "Privacy", to: "/privacy" }, { label: "Terms", to: "/terms" }, { label: "Cookies", to: "/cookies" }] },
  ] as const;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-semibold">Zentriq</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">A modern AI financial operating system for small businesses.</p>
          </div>
          {groups.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold">{c.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-foreground transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Zentriq. All rights reserved.</div>
          <div className="text-xs text-muted-foreground">Built for founders. Designed for clarity.</div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">{title}</h1>
        {subtitle && <p className="mt-5 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Last updated · {updated}</div>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:marker:text-primary [&_a]:text-foreground [&_a]:underline">
        {children}
      </div>
    </article>
  );
}
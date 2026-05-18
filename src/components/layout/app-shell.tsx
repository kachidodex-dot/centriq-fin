import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, CalendarRange, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/zentriq-logo.jpeg";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/monthly", label: "Monthly", icon: CalendarRange },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate({ to: "/" }); };

  const SidebarInner = (
    <>
      <Link to="/" className="flex items-center gap-2.5 px-2 py-1 group">
        <img src={logo} alt="Zentriq" className="h-9 w-9 rounded-lg object-contain shadow-glow transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
        <span className="font-semibold text-lg tracking-tight">Zentriq</span>
      </Link>
      <nav className="mt-8 space-y-1">
        {nav.map((item) => {
          const active = loc.pathname === item.to || (item.to !== "/dashboard" && loc.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <div className="rounded-lg border border-border p-3 text-xs">
          <div className="font-medium truncate">{user?.email}</div>
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start gap-2 px-2" onClick={handleSignOut}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-chart-2/20 blur-[120px]" />
      </div>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/60 backdrop-blur-xl px-4 py-3">
        <Link to="/" className="flex items-center gap-2"><img src={logo} alt="Zentriq" className="h-7 w-7 rounded-md object-contain" /><span className="font-semibold text-sm">Zentriq</span></Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur p-6 pt-20 flex flex-col">{SidebarInner}</div>
      )}

      <div className="lg:grid lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:flex lg:flex-col sticky top-0 h-screen border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl p-6">
          {SidebarInner}
        </aside>
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

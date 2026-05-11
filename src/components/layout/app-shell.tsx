import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, CalendarRange, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
      <Link to="/" className="flex items-center gap-2 px-2 py-1">
        <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground font-bold">Z</div>
        <span className="font-semibold">Zentriq</span>
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
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 py-3">
        <Link to="/" className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-md gradient-primary text-primary-foreground text-xs font-bold">Z</div><span className="font-semibold text-sm">Zentriq</span></Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur p-6 pt-20 flex flex-col">{SidebarInner}</div>
      )}

      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:flex lg:flex-col sticky top-0 h-screen border-r border-sidebar-border bg-sidebar p-6">
          {SidebarInner}
        </aside>
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

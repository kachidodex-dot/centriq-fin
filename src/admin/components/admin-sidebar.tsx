import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  Activity,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/zentriq-logo.jpeg";

const menuItems = [
  { icon: BarChart3, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: MessageSquare, label: "Feedback", href: "/admin/feedback" },
  { icon: Activity, label: "Activity Logs", href: "/admin/activity" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-lg bg-white dark:bg-gray-900 p-2 md:hidden shadow-md"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-6">
            <img src={logo} alt="Zentriq" className="h-8 w-8 rounded-full object-contain" />
            <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Admin
            </span>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    activeProps={{ className: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400" }}
                    className={cn(
                      "group flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                      "data-[status=active]:bg-blue-50 dark:data-[status=active]:bg-blue-950 data-[status=active]:text-blue-600 dark:data-[status=active]:text-blue-400"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold">Admin Portal</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

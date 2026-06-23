"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Warehouse,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  TrendingDown,
  Store,
} from "lucide-react";
import { cn } from "@/lib/billease/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/invoices", label: "Invoices", icon: FileText, group: "main" },
  { href: "/purchases", label: "Purchases", icon: ShoppingCart, group: "main" },
  { href: "/expenses", label: "Expenses", icon: TrendingDown, group: "main" },
  { href: "/parties", label: "Parties", icon: Users, group: "books" },
  { href: "/payments", label: "Payments", icon: CreditCard, group: "books" },
  { href: "/items", label: "Products", icon: Package, group: "books" },
  { href: "/inventory", label: "Inventory", icon: Warehouse, group: "books" },
  { href: "/store", label: "Digital Store", icon: Store, group: "reports" },
  { href: "/reports", label: "Reports", icon: BarChart3, group: "reports" },
  { href: "/settings", label: "Settings", icon: Settings, group: "settings" },
];

const groups = [
  { id: "main", label: "Billing" },
  { id: "books", label: "Books" },
  { id: "reports", label: "Analytics" },
  { id: "settings", label: "Account" },
];

export function Sidebar({ businessName }: { businessName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[224px] flex-col border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/30">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">Bill Book</h1>
            <p className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
              {businessName ?? "Your business"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {groups.map((group) => {
          const groupLinks = links.filter((l) => l.group === group.id);
          if (groupLinks.length === 0) return null;
          return (
            <div key={group.id} className="mb-4">
              <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                {group.label}
              </p>
              {groupLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all mb-0.5",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}


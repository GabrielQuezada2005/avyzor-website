"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ADMIN_NAV_ITEMS, ADMIN_PORTAL_LINK } from "@/lib/admin";
import type { AdminNavId } from "@/lib/admin/types";
import { clearAdminToken } from "@/lib/admin/client-api";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<AdminNavId, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  crm: Users,
  appointments: Calendar,
  payments: CreditCard,
  settings: Settings,
};

interface AdminShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onLogout?: () => void;
}

export function AdminShell({
  title,
  subtitle,
  children,
  actions,
  onLogout,
}: AdminShellProps) {
  const pathname = usePathname();

  function handleLogout() {
    clearAdminToken();
    onLogout?.();
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="pointer-events-none fixed inset-0 bg-radial-gold opacity-40" />

      <div className="relative flex min-h-screen">
        {/* Sidebar – Desktop & Tablet */}
        <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-white/10 bg-dark-900/90 backdrop-blur-xl">
          <div className="border-b border-white/10 px-5 py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/25">
                <Sparkles className="h-4 w-4 text-gold-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400/70">
                  AVYZOR
                </p>
                <p className="font-display text-sm font-semibold text-white">
                  Admin
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3" aria-label="Admin-Navigation">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.id];
              const active = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gold-500/15 text-gold-300 border border-gold-500/25"
                      : "text-white/60 hover:bg-white/5 hover:text-gold-300 border border-transparent"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-3 border-t border-white/10 pt-3">
              <Link
                href={ADMIN_PORTAL_LINK.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-gold-300"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                {ADMIN_PORTAL_LINK.label}
              </Link>
            </div>
          </nav>

          <div className="border-t border-white/10 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white/55 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile / Tablet top bar */}
          <header className="border-b border-white/10 bg-dark-900/80 backdrop-blur-md md:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400/70">
                  AVYZOR Admin
                </p>
                <p className="font-display text-lg font-semibold text-gradient-gold">
                  {title}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <nav
              className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none"
              aria-label="Admin-Navigation mobil"
            >
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      active
                        ? "bg-gold-500/15 text-gold-300"
                        : "text-white/55 hover:text-gold-300"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {/* Desktop header */}
          <header className="hidden border-b border-white/10 bg-dark-900/60 backdrop-blur-md md:block">
            <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8">
              <div>
                {subtitle && (
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-400/70">
                    {subtitle}
                  </p>
                )}
                <h1 className="font-display text-2xl font-semibold text-gradient-gold lg:text-3xl">
                  {title}
                </h1>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

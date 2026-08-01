"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PORTAL_NAV_ITEMS } from "@/lib/portal";
import { logoutPortal } from "@/lib/portal/client-api";
import { cn } from "@/lib/utils";
import type { PortalSession } from "@/lib/portal/types";

interface PortalShellProps {
  session: PortalSession;
  children: React.ReactNode;
}

export function PortalShell({ session, children }: PortalShellProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await logoutPortal();
    window.location.href = "/portal/login";
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="pointer-events-none fixed inset-0 bg-radial-gold opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400/70">
              AVYZOR Kundenportal
            </p>
            <h1 className="font-display text-2xl font-semibold text-gradient-gold">
              Willkommen, {session.name}
            </h1>
            <p className="text-sm text-white/45">{session.email}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => void handleLogout()}>
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <nav className="lg:w-56 shrink-0">
            <ul className="space-y-1 rounded-2xl border border-white/10 bg-dark-800/40 p-2">
              {PORTAL_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-4 py-2.5 text-sm transition",
                      pathname === item.href
                        ? "bg-gold-500/15 text-gold-300"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

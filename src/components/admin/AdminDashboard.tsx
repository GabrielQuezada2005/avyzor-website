"use client";

import Link from "next/link";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_QUICK_LINKS } from "@/lib/admin";
import type { AdminDashboardStats } from "@/lib/admin/types";
import {
  fetchAdminStats,
  formatAdminCurrency,
  formatAdminDate,
} from "@/lib/admin/client-api";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        onLogout();
        return;
      }
      setError(
        err instanceof Error ? err.message : "Statistiken konnten nicht geladen werden."
      );
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return (
    <AdminShell
      title="Übersicht"
      subtitle="AVYZOR Admin"
      onLogout={onLogout}
      actions={
        <Button variant="ghost" size="sm" onClick={() => void loadStats()} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </Button>
      }
    >
      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard
          label="Neue Leads"
          value={stats?.newLeads ?? 0}
          loading={loading}
          accent="gold"
        />
        <KpiCard
          label="Aktive Kunden"
          value={stats?.activeCustomers ?? 0}
          loading={loading}
          accent="green"
        />
        <KpiCard
          label="Angebote"
          value={stats?.quotes ?? 0}
          loading={loading}
          accent="blue"
        />
        <KpiCard
          label="Termine"
          value={stats?.appointments ?? 0}
          loading={loading}
          accent="purple"
        />
        <KpiCard
          label="Umsatz"
          value={
            stats?.revenueIsPlaceholder
              ? "—"
              : formatAdminCurrency(stats?.revenueCents ?? 0)
          }
          hint={stats?.revenueIsPlaceholder ? "Platzhalter" : "Bezahlt (Stripe)"}
          loading={loading}
          accent="neutral"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {stats?.updatedAt && (
        <p className="mt-3 text-xs text-white/35">
          Zuletzt aktualisiert: {formatAdminDate(stats.updatedAt)}
        </p>
      )}

      {/* Quick Access */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Schnellzugriff
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ADMIN_QUICK_LINKS.map((link) => (
            <QuickLinkCard key={link.title} {...link} />
          ))}
        </div>
      </section>

      {/* Summary strip */}
      <section className="mt-10 rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 via-dark-800/40 to-dark-900/60 p-6">
        <h2 className="font-display text-lg font-semibold text-gradient-gold">
          Willkommen im AVYZOR Admin
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          Zentrale Steuerung für Leads, Angebote, Termine und Zahlungen. Alle Bereiche
          sind miteinander verknüpft – vom Chat-Lead über das CRM bis zum Kundenportal.
        </p>
      </section>
    </AdminShell>
  );
}

function KpiCard({
  label,
  value,
  hint,
  loading,
  accent,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  loading?: boolean;
  accent: "gold" | "green" | "blue" | "purple" | "neutral";
  className?: string;
}) {
  const accentClasses = {
    gold: "border-gold-500/25 from-gold-500/10",
    green: "border-emerald-500/25 from-emerald-500/10",
    blue: "border-sky-500/25 from-sky-500/10",
    purple: "border-violet-500/25 from-violet-500/10",
    neutral: "border-white/15 from-white/5",
  }[accent];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br to-dark-900/50 p-5 backdrop-blur-sm",
        accentClasses,
        className
      )}
    >
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-white">
        {loading ? "…" : value}
      </p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  href,
  external,
  accent,
}: (typeof ADMIN_QUICK_LINKS)[number]) {
  const accentRing = {
    gold: "hover:border-gold-500/35 group-hover:text-gold-300",
    blue: "hover:border-sky-500/35 group-hover:text-sky-300",
    green: "hover:border-emerald-500/35 group-hover:text-emerald-300",
    purple: "hover:border-violet-500/35 group-hover:text-violet-300",
    neutral: "hover:border-white/25 group-hover:text-white",
  }[accent];

  const inner = (
    <div
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-white/10 bg-dark-800/40 p-5 transition-all duration-300 hover:bg-dark-800/70",
        accentRing
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-current" />
      </div>
      <p className="mt-2 flex-1 text-sm text-white/50">{description}</p>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}

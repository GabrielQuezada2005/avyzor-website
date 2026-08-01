"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminServiceStatus } from "@/lib/admin/types";
import { fetchAdminServiceStatus } from "@/lib/admin/client-api";
import { cn } from "@/lib/utils";

interface AdminSettingsViewProps {
  onLogout: () => void;
}

const SERVICE_ITEMS: Array<{
  key: keyof AdminServiceStatus;
  label: string;
  description: string;
}> = [
  {
    key: "crm",
    label: "CRM Admin",
    description: "CRM_ADMIN_SECRET für Admin-Zugang",
  },
  {
    key: "supabase",
    label: "Supabase",
    description: "Datenbank für Leads, Angebote, Zahlungen",
  },
  {
    key: "stripe",
    label: "Stripe",
    description: "Online-Zahlungen (Checkout)",
  },
  {
    key: "resend",
    label: "Resend",
    description: "E-Mail-Versand für Formulare & CRM",
  },
  {
    key: "portal",
    label: "Kundenportal",
    description: "PORTAL_AUTH_SECRET für Portal-Login",
  },
];

export function AdminSettingsView({ onLogout }: AdminSettingsViewProps) {
  const [services, setServices] = useState<AdminServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminServiceStatus();
      setServices(data);
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        onLogout();
        return;
      }
      setError(err instanceof Error ? err.message : "Einstellungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  return (
    <AdminShell title="Einstellungen" subtitle="Systemstatus" onLogout={onLogout}>
      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {SERVICE_ITEMS.map((item) => {
          const active = services?.[item.key] ?? false;

          return (
            <div
              key={item.key}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-dark-800/40 p-5"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  active
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-white/10 bg-white/5"
                )}
              >
                {active ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-white/35" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{item.label}</h3>
                <p className="mt-1 text-sm text-white/50">{item.description}</p>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium uppercase tracking-wider",
                    active ? "text-emerald-400" : "text-white/35"
                  )}
                >
                  {loading ? "…" : active ? "Konfiguriert" : "Nicht konfiguriert"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-dark-800/30 p-6">
        <h2 className="font-display text-base font-semibold text-white">
          Umgebungsvariablen
        </h2>
        <p className="mt-2 text-sm text-white/55">
          Konfiguration erfolgt über <code className="text-gold-300/80">.env.local</code> bzw.
          Vercel Environment Variables. Secrets werden hier nicht angezeigt.
        </p>
        <ul className="mt-4 space-y-1 text-xs text-white/40 font-mono">
          <li>CRM_ADMIN_SECRET</li>
          <li>NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY</li>
          <li>STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET</li>
          <li>RESEND_API_KEY</li>
          <li>PORTAL_AUTH_SECRET</li>
        </ul>
      </section>
    </AdminShell>
  );
}

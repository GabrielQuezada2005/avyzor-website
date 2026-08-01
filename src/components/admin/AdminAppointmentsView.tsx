"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AdminShell } from "@/components/admin/AdminShell";
import type { CrmAppointment } from "@/lib/booking/types";
import {
  formatAdminDate,
  formatAdminDateOnly,
  getAdminToken,
} from "@/lib/admin/client-api";
import { cn } from "@/lib/utils";

interface AdminAppointmentsViewProps {
  onLogout: () => void;
}

export function AdminAppointmentsView({ onLogout }: AdminAppointmentsViewProps) {
  const [appointments, setAppointments] = useState<CrmAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAdminToken();
      const response = await fetch("/api/admin/appointments", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = (await response.json()) as {
        success: boolean;
        appointments?: CrmAppointment[];
        error?: string;
      };

      if (!response.ok || !data.success || !data.appointments) {
        throw new Error(data.error ?? "Termine konnten nicht geladen werden.");
      }

      setAppointments(data.appointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  return (
    <AdminShell
      title="Termine"
      subtitle="Beratung & Buchungen"
      onLogout={onLogout}
      actions={
        <Button variant="ghost" size="sm" onClick={() => void loadAppointments()} disabled={loading}>
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

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark-800/40">
        {loading ? (
          <p className="px-6 py-16 text-center text-white/50">Termine werden geladen…</p>
        ) : appointments.length === 0 ? (
          <p className="px-6 py-16 text-center text-white/50">
            Noch keine Termine gebucht.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                  <th className="px-5 py-4 font-medium">Datum</th>
                  <th className="px-5 py-4 font-medium">Kunde</th>
                  <th className="px-5 py-4 font-medium">Leistung</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 text-white">
                      {formatAdminDateOnly(item.scheduledDate)} · {item.scheduledTime}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-white/45">{item.email}</div>
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {item.service ?? "Beratung"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-5 py-4 text-white/45">
                      {formatAdminDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "confirmed"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
      : "bg-white/5 text-white/60 border-white/10";

  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs", tone)}>
      {status}
    </span>
  );
}

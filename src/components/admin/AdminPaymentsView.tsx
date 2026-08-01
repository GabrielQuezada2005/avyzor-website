"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  CRM_PAYMENT_METHOD_LABELS,
  CRM_PAYMENT_STATUS_LABELS,
  type CrmPayment,
} from "@/lib/payments";
import {
  formatAdminCurrency,
  formatAdminDate,
  getAdminToken,
} from "@/lib/admin/client-api";
import { cn } from "@/lib/utils";

interface AdminPaymentsViewProps {
  onLogout: () => void;
}

export function AdminPaymentsView({ onLogout }: AdminPaymentsViewProps) {
  const [payments, setPayments] = useState<CrmPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAdminToken();
      const response = await fetch("/api/admin/payments", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = (await response.json()) as {
        success: boolean;
        payments?: CrmPayment[];
        error?: string;
      };

      if (!response.ok || !data.success || !data.payments) {
        throw new Error(data.error ?? "Zahlungen konnten nicht geladen werden.");
      }

      setPayments(data.payments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const succeededTotal = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <AdminShell
      title="Zahlungen"
      subtitle="Stripe Checkout"
      onLogout={onLogout}
      actions={
        <Button variant="ghost" size="sm" onClick={() => void loadPayments()} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Zahlungen gesamt" value={payments.length} loading={loading} />
        <SummaryCard
          label="Bezahlt"
          value={payments.filter((p) => p.status === "succeeded").length}
          loading={loading}
        />
        <SummaryCard
          label="Umsatz (bezahlt)"
          value={succeededTotal > 0 ? formatAdminCurrency(succeededTotal) : "—"}
          hint={succeededTotal === 0 ? "Platzhalter bis erste Zahlung" : undefined}
          loading={loading}
        />
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark-800/40">
        {loading ? (
          <p className="px-6 py-16 text-center text-white/50">Zahlungen werden geladen…</p>
        ) : payments.length === 0 ? (
          <p className="px-6 py-16 text-center text-white/50">
            Noch keine Zahlungen erfasst. Stripe-Checkout-Links können im CRM erstellt werden.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                  <th className="px-5 py-4 font-medium">Betrag</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Referenz</th>
                  <th className="px-5 py-4 font-medium">Methode</th>
                  <th className="px-5 py-4 font-medium">Datum</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 font-medium text-gold-300">
                      {formatAdminCurrency(payment.amountCents, payment.currency)}
                    </td>
                    <td className="px-5 py-4">
                      <PaymentStatusPill status={payment.status} />
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {payment.description ?? payment.referenceType}
                    </td>
                    <td className="px-5 py-4 text-white/55">
                      {payment.paymentMethod
                        ? CRM_PAYMENT_METHOD_LABELS[payment.paymentMethod]
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-white/45">
                      {formatAdminDate(payment.createdAt)}
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

function SummaryCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: number | string;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-dark-800/40 p-5">
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-white">
        {loading ? "…" : value}
      </p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

function PaymentStatusPill({ status }: { status: CrmPayment["status"] }) {
  const tone =
    status === "succeeded"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
      : status === "failed" || status === "cancelled"
        ? "bg-red-500/10 text-red-300 border-red-500/25"
        : "bg-gold-500/10 text-gold-200 border-gold-500/25";

  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs", tone)}>
      {CRM_PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}

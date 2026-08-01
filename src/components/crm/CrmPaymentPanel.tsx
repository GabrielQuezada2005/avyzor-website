"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  CRM_PAYMENT_METHOD_LABELS,
  CRM_PAYMENT_STATUS_LABELS,
  type CrmPayment,
} from "@/lib/payments";
import {
  createCrmLeadPaymentLink,
  fetchCrmLeadPayments,
  formatCrmCurrency,
  formatCrmDate,
} from "@/lib/crm/client-api";
import type { CrmLead } from "@/lib/crm/types";

interface CrmPaymentPanelProps {
  lead: CrmLead;
}

function PaymentStatusBadge({ status }: { status: CrmPayment["status"] }) {
  const tone =
    status === "succeeded"
      ? "border-green-500/30 bg-green-500/10 text-green-300"
      : status === "failed" || status === "cancelled"
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : "border-gold-500/30 bg-gold-500/10 text-gold-200";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs ${tone}`}>
      {CRM_PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}

export function CrmPaymentPanel({ lead }: CrmPaymentPanelProps) {
  const [payments, setPayments] = useState<CrmPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCrmLeadPayments(lead.id);
      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Zahlungen konnten nicht geladen werden."
      );
    } finally {
      setLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  async function handleCreatePaymentLink() {
    setCreating(true);
    setError(null);
    setFeedback(null);
    setCheckoutUrl(null);

    try {
      const result = await createCrmLeadPaymentLink(lead.id);
      setCheckoutUrl(result.url);
      setFeedback("Zahlungslink erstellt. Der Kunde kann über Stripe bezahlen.");
      if (result.payment) {
        setPayments((current) => [result.payment!, ...current]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Zahlungslink konnte nicht erstellt werden."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
        Zahlungen
      </h3>

      <div className="rounded-xl border border-white/10 bg-dark-900/50 p-4 space-y-4">
        <p className="text-xs text-white/45">
          Stripe Checkout: PayPal, Klarna, Apple Pay, Google Pay, Kreditkarte.
          Verknüpfbar mit Angeboten und künftigen Rechnungen.
        </p>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          isLoading={creating}
          onClick={() => void handleCreatePaymentLink()}
        >
          <CreditCard size={16} />
          Zahlungslink für Angebot erstellen
        </Button>

        {checkoutUrl && (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300"
          >
            <ExternalLink size={14} />
            Checkout-Link öffnen
          </a>
        )}

        {feedback && <p className="text-sm text-green-400">{feedback}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div>
          <h4 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            Zahlungshistorie
          </h4>

          {loading ? (
            <p className="text-sm text-white/50">Wird geladen…</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-white/50">Noch keine Zahlungen erfasst.</p>
          ) : (
            <ul className="space-y-3">
              {payments.map((payment) => (
                <li
                  key={payment.id}
                  className="rounded-lg border border-white/10 bg-dark-800/40 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">
                      {formatCrmCurrency(payment.amountCents, payment.currency)}
                    </span>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                  <div className="mt-1 text-xs text-white/45">
                    {payment.description ?? payment.referenceType} ·{" "}
                    {formatCrmDate(payment.createdAt)}
                  </div>
                  {payment.paymentMethod && (
                    <div className="mt-1 text-xs text-white/55">
                      {CRM_PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  fetchPortalDashboard,
  formatPortalCurrency,
  formatPortalDate,
  formatPortalDateOnly,
} from "@/lib/portal/client-api";
import type { PortalDashboardData } from "@/lib/portal/types";

type PortalSection =
  | "overview"
  | "offers"
  | "appointments"
  | "invoices"
  | "projects"
  | "messages";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-dark-800/40 p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
        {title}
      </h2>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-white/50">{text}</p>;
}

interface PortalDataViewProps {
  section?: PortalSection;
}

export function PortalDataView({ section = "overview" }: PortalDataViewProps) {
  const [data, setData] = useState<PortalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await fetchPortalDashboard();
        setData(dashboard);
      } catch (err) {
        if (err instanceof Error && err.message === "SESSION_EXPIRED") {
          window.location.href = "/portal/login";
          return;
        }
        setError(
          err instanceof Error ? err.message : "Daten konnten nicht geladen werden."
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return <p className="text-white/50">Daten werden geladen…</p>;
  }

  if (error || !data) {
    return <p className="text-red-400">{error ?? "Keine Daten verfügbar."}</p>;
  }

  const showProject = section === "overview" || section === "projects";
  const showOffers = section === "overview" || section === "offers";
  const showAppointments = section === "overview" || section === "appointments";
  const showInvoices = section === "overview" || section === "invoices";
  const showMessages = section === "overview" || section === "messages";

  return (
    <div className="space-y-6">
      {showProject && (
        <Panel title="Projektstatus">
          {data.project ? (
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-white/40">Status</dt>
                <dd className="text-white">{data.project.statusLabel}</dd>
              </div>
              <div>
                <dt className="text-white/40">Leistung</dt>
                <dd className="text-white">{data.project.service ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40">Zeitrahmen</dt>
                <dd className="text-white">{data.project.timeline ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-white/40">Fortschritt</dt>
                <dd className="text-white">{data.project.completenessScore}%</dd>
              </div>
              <div>
                <dt className="text-white/40">Aktualisiert</dt>
                <dd className="text-white">{formatPortalDate(data.project.updatedAt)}</dd>
              </div>
            </dl>
          ) : (
            <EmptyState text="Noch kein Projekt mit Ihrem Konto verknüpft." />
          )}
        </Panel>
      )}

      <div className={section === "overview" ? "grid gap-6 lg:grid-cols-2" : "space-y-6"}>
        {showOffers && (
          <Panel title="Angebote">
            {data.offers.length === 0 ? (
              <EmptyState text="Keine Angebote vorhanden." />
            ) : (
              <ul className="space-y-3">
                {data.offers.map((offer) => (
                  <li
                    key={offer.id}
                    className="rounded-xl border border-white/10 bg-dark-900/40 p-4 text-sm"
                  >
                    <div className="font-medium text-white">{offer.quoteNumber}</div>
                    <div className="text-white/70">{offer.serviceTitle}</div>
                    <div className="mt-2 text-gold-300">
                      {formatPortalCurrency(offer.priceAmount, offer.priceCurrency)}
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      Gültig bis {formatPortalDateOnly(offer.validUntil)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        {showAppointments && (
          <Panel title="Termine">
            {data.appointments.length === 0 ? (
              <EmptyState text="Keine Termine vorhanden." />
            ) : (
              <ul className="space-y-3">
                {data.appointments.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-dark-900/40 p-4 text-sm"
                  >
                    <div className="font-medium text-white">
                      {formatPortalDateOnly(item.scheduledDate)} · {item.scheduledTime} Uhr
                    </div>
                    <div className="text-white/70">{item.service ?? "Beratungstermin"}</div>
                    <div className="mt-1 text-xs text-white/40">{item.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}
      </div>

      {(showInvoices || showMessages) && (
        <div className={section === "overview" ? "grid gap-6 lg:grid-cols-2" : "space-y-6"}>
          {showInvoices && (
            <Panel title="Rechnungen">
              <ul className="space-y-3">
                {data.invoices.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="rounded-xl border border-dashed border-white/15 bg-dark-900/20 p-4 text-sm"
                  >
                    <div className="font-medium text-white">{invoice.invoiceNumber}</div>
                    <div className="text-white/50">
                      Platzhalter – noch keine echten Rechnungen
                    </div>
                    <div className="mt-1 text-xs text-white/40">{invoice.status}</div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {showMessages && (
            <Panel title="Nachrichten">
              {data.messages.length === 0 ? (
                <EmptyState text="Keine Nachrichten vorhanden." />
              ) : (
                <ul className="space-y-3">
                  {data.messages.map((message) => (
                    <li
                      key={message.id}
                      className="rounded-xl border border-white/10 bg-dark-900/40 p-4 text-sm"
                    >
                      <div className="font-medium text-white">{message.subject}</div>
                      <div className="mt-1 text-xs text-white/40">
                        {formatPortalDate(message.createdAt)} · {message.status}
                      </div>
                      {message.preview && (
                        <p className="mt-2 text-white/55 line-clamp-3">{message.preview}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}

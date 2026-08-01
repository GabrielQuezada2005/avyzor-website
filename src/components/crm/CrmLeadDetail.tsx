"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  CRM_LEAD_STATUSES,
  CRM_LEAD_STATUS_LABELS,
} from "@/lib/crm/constants";
import { formatCrmDate } from "@/lib/crm/client-api";
import type { CrmLead, CrmLeadStatus } from "@/lib/crm/types";
import { CrmEmailPanel } from "./CrmEmailPanel";
import { CrmPaymentPanel } from "./CrmPaymentPanel";
import { CrmStatusBadge } from "./CrmStatusBadge";

interface CrmLeadDetailProps {
  lead: CrmLead;
  onClose: () => void;
  onStatusChange: (status: CrmLeadStatus) => Promise<void>;
  updating: boolean;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-white/40">{label}</dt>
      <dd className="mt-1 text-sm text-white/90">{value?.trim() || "—"}</dd>
    </div>
  );
}

export function CrmLeadDetail({
  lead,
  onClose,
  onStatusChange,
  updating,
}: CrmLeadDetailProps) {
  return (
    <aside className="flex h-full flex-col border-l border-white/10 bg-dark-800/95 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">
            Lead-Details
          </h2>
          <p className="mt-0.5 text-xs text-white/40">
            Erstellt {formatCrmDate(lead.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
          aria-label="Detailansicht schließen"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <div className="flex items-center gap-3">
          <CrmStatusBadge status={lead.status} />
          <span className="text-xs text-white/40">
            Vollständigkeit: {lead.completenessScore}%
          </span>
        </div>

        <div className="rounded-xl border border-white/10 bg-dark-900/50 p-4">
          <Select
            id="lead-status"
            label="Status ändern"
            value={lead.status}
            disabled={updating}
            onChange={(e) =>
              void onStatusChange(e.target.value as CrmLeadStatus)
            }
            options={CRM_LEAD_STATUSES.map((status) => ({
              value: status,
              label: CRM_LEAD_STATUS_LABELS[status],
            }))}
          />
        </div>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
            Kontakt
          </h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Name" value={lead.name} />
            <DetailField label="Firma" value={lead.company} />
            <DetailField label="E-Mail" value={lead.email} />
            <DetailField label="Telefon" value={lead.phone} />
          </dl>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
            Projekt
          </h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Dienstleistung" value={lead.service} />
            <DetailField label="Budget" value={lead.budget} />
            <DetailField label="Zeitrahmen" value={lead.timeline} />
            <DetailField label="Interesse" value={lead.interestLevel} />
          </dl>
        </section>

        {lead.detectedServices.length > 0 && (
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
              Erkannte Leistungen
            </h3>
            <div className="flex flex-wrap gap-2">
              {lead.detectedServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs text-gold-200"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>
        )}

        <CrmEmailPanel lead={lead} />

        <CrmPaymentPanel lead={lead} />

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
            Meta
          </h3>
          <dl className="grid gap-4">
            <DetailField label="Quelle" value={lead.source} />
            <DetailField label="Session-ID" value={lead.sessionId} />
            <DetailField
              label="Zuletzt aktualisiert"
              value={formatCrmDate(lead.updatedAt)}
            />
          </dl>
        </section>
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Schließen
        </Button>
      </div>
    </aside>
  );
}

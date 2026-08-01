"use client";

import { cn } from "@/lib/utils";
import { formatCrmDate } from "@/lib/crm/client-api";
import type { CrmLead } from "@/lib/crm/types";
import { CrmStatusBadge } from "./CrmStatusBadge";

interface CrmLeadTableProps {
  leads: CrmLead[];
  selectedId: string | null;
  onSelect: (lead: CrmLead) => void;
}

function displayValue(value: string | null): string {
  return value?.trim() || "—";
}

export function CrmLeadTable({
  leads,
  selectedId,
  onSelect,
}: CrmLeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-dark-800/30 px-6 py-16 text-center">
        <p className="text-white/60">Keine Leads gefunden.</p>
        <p className="mt-1 text-sm text-white/40">
          Passe Suche oder Filter an – oder warte auf neue Chat-Leads.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / Tablet table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-dark-800/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-dark-900/60 text-xs uppercase tracking-wider text-white/40">
                <th className="px-5 py-3 font-medium">Name / Firma</th>
                <th className="px-5 py-3 font-medium">Kontakt</th>
                <th className="px-5 py-3 font-medium">Leistung</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className={cn(
                    "cursor-pointer border-b border-white/5 transition hover:bg-gold-500/5",
                    selectedId === lead.id && "bg-gold-500/10"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">
                      {displayValue(lead.name)}
                    </div>
                    <div className="text-xs text-white/45">
                      {displayValue(lead.company)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-white/80">{displayValue(lead.email)}</div>
                    <div className="text-xs text-white/45">
                      {displayValue(lead.phone)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/75 max-w-[180px] truncate">
                    {displayValue(lead.service)}
                  </td>
                  <td className="px-5 py-4">
                    <CrmStatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-4 text-white/50 whitespace-nowrap">
                    {formatCrmDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards (fallback for narrow tablet) */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => onSelect(lead)}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-dark-800/40 p-4 text-left transition hover:border-gold-500/30",
              selectedId === lead.id && "border-gold-500/40 bg-gold-500/5"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-white">
                  {displayValue(lead.name)}
                </div>
                <div className="text-xs text-white/45">
                  {displayValue(lead.company)}
                </div>
              </div>
              <CrmStatusBadge status={lead.status} />
            </div>
            <div className="mt-3 text-xs text-white/55 space-y-1">
              <div>{displayValue(lead.email)}</div>
              <div>{displayValue(lead.service)}</div>
              <div>{formatCrmDate(lead.createdAt)}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  CRM_LEAD_STATUSES,
  CRM_LEAD_STATUS_LABELS,
} from "@/lib/crm/constants";
import {
  fetchCrmLeads,
  updateCrmLeadStatusClient,
} from "@/lib/crm/client-api";
import type { CrmLead, CrmLeadStatus } from "@/lib/crm/types";
import { CrmLeadDetail } from "./CrmLeadDetail";
import { CrmLeadTable } from "./CrmLeadTable";
import { cn } from "@/lib/utils";

type StatusFilter = CrmLeadStatus | "all";

function CrmDashboardContent({ onLogout }: { onLogout: () => void }) {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCrmLeads();
      setLeads(data);
      setSelectedLead((current) =>
        current ? data.find((lead) => lead.id === current.id) ?? null : null
      );
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        onLogout();
        setError("Sitzung abgelaufen. Bitte erneut anmelden.");
      } else {
        setError(
          err instanceof Error ? err.message : "Leads konnten nicht geladen werden."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
        lead.service,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [leads, statusFilter, debouncedSearch]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const status of CRM_LEAD_STATUSES) {
      counts[status] = leads.filter((lead) => lead.status === status).length;
    }
    return counts;
  }, [leads]);

  async function handleStatusChange(status: CrmLeadStatus) {
    if (!selectedLead) return;

    setUpdating(true);
    setError(null);

    try {
      const updated = await updateCrmLeadStatusClient(selectedLead.id, status);
      setSelectedLead(updated);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === updated.id ? updated : lead))
      );
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        onLogout();
      }
      setError(
        err instanceof Error
          ? err.message
          : "Status konnte nicht aktualisiert werden."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <AdminShell
      title="CRM"
      subtitle="Lead-Verwaltung"
      onLogout={onLogout}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void loadLeads()}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </Button>
      }
    >
      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Gesamt" value={statusCounts.all ?? 0} />
            {CRM_LEAD_STATUSES.map((status) => (
              <StatCard
                key={status}
                label={CRM_LEAD_STATUS_LABELS[status]}
                value={statusCounts[status] ?? 0}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </div>

      {/* Toolbar */}
      <div className="mb-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-dark-800/40 p-4 sm:flex-row sm:items-end">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-[2.65rem] h-4 w-4 text-white/35" />
              <Input
                id="crm-search"
                label="Suche"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, Firma, E-Mail, Telefon, Leistung…"
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-56">
              <Select
                id="crm-status-filter"
                label="Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                options={[
                  { value: "all", label: "Alle Status" },
                  ...CRM_LEAD_STATUSES.map((status) => ({
                    value: status,
                    label: CRM_LEAD_STATUS_LABELS[status],
                  })),
                ]}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 gap-0">
          <div
            className={`flex-1 min-w-0 transition-all ${
              selectedLead ? "lg:pr-0" : ""
            }`}
          >
            {loading && leads.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-dark-800/40 py-20 text-white/50">
                Leads werden geladen…
              </div>
            ) : (
              <CrmLeadTable
                leads={filteredLeads}
                selectedId={selectedLead?.id ?? null}
                onSelect={setSelectedLead}
              />
            )}
          </div>

          {selectedLead && (
            <div className="fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto lg:w-[380px] xl:w-[420px] lg:shrink-0">
              <div
                className="absolute inset-0 bg-black/60 lg:hidden"
                onClick={() => setSelectedLead(null)}
                aria-hidden
              />
              <div className="absolute inset-y-0 right-0 w-full max-w-md lg:relative lg:max-w-none lg:h-[calc(100vh-280px)] lg:sticky lg:top-6">
                <CrmLeadDetail
                  lead={selectedLead}
                  onClose={() => setSelectedLead(null)}
                  onStatusChange={handleStatusChange}
                  updating={updating}
                />
              </div>
            </div>
          )}
        </div>
    </AdminShell>
  );
}

export function CrmDashboard() {
  return (
    <AdminAuthGate>
      {({ onLogout }) => <CrmDashboardContent onLogout={onLogout} />}
    </AdminAuthGate>
  );
}

function StatCard({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        active
          ? "border-gold-500/40 bg-gold-500/10"
          : "border-white/10 bg-dark-800/40 hover:border-gold-500/20"
      }`}
    >
      <div className="flex items-center gap-2 text-white/45">
        <Users className="h-3.5 w-3.5" />
        <span className="text-xs truncate">{label}</span>
      </div>
      <div className="mt-1 font-display text-2xl font-semibold text-white">
        {value}
      </div>
    </Component>
  );
}

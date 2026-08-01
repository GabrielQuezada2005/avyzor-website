/**
 * CRM – Mapping von Lead-Erkennung zu CRM-Datensätzen
 */

import type { LeadDetectionRecord } from "@/lib/assistant/lead-detection";
import { DEFAULT_CRM_LEAD_SOURCE } from "./constants";
import type { CrmLead, CrmLeadRow, CrmLeadUpsertInput } from "./types";

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (!value?.trim() || value.trim() === "—") return null;
  return value.trim();
}

/**
 * Prüft, ob ein erkanntes Lead-Profil CRM-relevante Daten enthält.
 */
export function shouldPersistCrmLead(record: LeadDetectionRecord): boolean {
  const { profile } = record;
  const hasContactData = Boolean(
    profile.email || profile.phone || profile.name || profile.company
  );
  const hasProjectData = Boolean(
    profile.desiredService || profile.budget || profile.timeline
  );

  if (hasContactData) return true;

  if (
    record.serviceInterestLevel === "ready" &&
    (hasProjectData || record.detectedServices.length > 0)
  ) {
    return true;
  }

  return hasProjectData && record.serviceInterestLevel === "interested";
}

/**
 * Mappt ein Lead-Erkennungsergebnis auf CRM-Upsert-Daten.
 */
export function mapLeadDetectionToCrmInput(
  record: LeadDetectionRecord
): CrmLeadUpsertInput {
  const { profile } = record;

  return {
    sessionId: record.sessionId,
    name: normalizeOptionalText(profile.name),
    company: normalizeOptionalText(profile.company),
    email: normalizeOptionalText(profile.email),
    phone: normalizeOptionalText(profile.phone),
    service: normalizeOptionalText(profile.desiredService),
    budget: normalizeOptionalText(profile.budget),
    timeline: normalizeOptionalText(profile.timeline),
    source: DEFAULT_CRM_LEAD_SOURCE,
    interestLevel: record.serviceInterestLevel,
    completenessScore: record.completenessScore,
    detectedServices: record.detectedServices,
  };
}

/** Mappt eine Supabase-Zeile auf das CRM-Domain-Modell. */
export function mapCrmLeadRow(row: CrmLeadRow): CrmLead {
  return {
    id: row.id,
    sessionId: row.session_id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    service: row.service,
    budget: row.budget,
    timeline: row.timeline,
    status: row.status as CrmLead["status"],
    source: row.source as CrmLead["source"],
    interestLevel: row.interest_level,
    completenessScore: row.completeness_score ?? 0,
    detectedServices: row.detected_services ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Führt bestehende und neue Felder zusammen (neue Werte überschreiben nur wenn gesetzt).
 */
export function mergeCrmLeadFields(
  existing: CrmLeadRow,
  incoming: CrmLeadUpsertInput
): Record<string, unknown> {
  const pick = (
    next: string | null | undefined,
    current: string | null
  ): string | null => (next ?? current);

  return {
    session_id: existing.session_id,
    name: pick(incoming.name, existing.name),
    company: pick(incoming.company, existing.company),
    email: pick(incoming.email, existing.email),
    phone: pick(incoming.phone, existing.phone),
    service: pick(incoming.service, existing.service),
    budget: pick(incoming.budget, existing.budget),
    timeline: pick(incoming.timeline, existing.timeline),
    interest_level: incoming.interestLevel ?? existing.interest_level,
    completeness_score:
      incoming.completenessScore ?? existing.completeness_score ?? 0,
    detected_services:
      incoming.detectedServices ?? existing.detected_services ?? [],
    updated_at: new Date().toISOString(),
  };
}

import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import {
  CRM_LEADS_TABLE,
  DEFAULT_CRM_LEAD_SOURCE,
  DEFAULT_CRM_LEAD_STATUS,
} from "./constants";
import {
  mapCrmLeadRow,
  mergeCrmLeadFields,
} from "./map-from-detection";
import type {
  CrmLead,
  CrmLeadListOptions,
  CrmLeadRow,
  CrmLeadStatus,
  CrmLeadUpsertInput,
} from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

function toInsertRow(input: CrmLeadUpsertInput): Record<string, unknown> {
  return {
    session_id: input.sessionId,
    name: input.name ?? null,
    company: input.company ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    service: input.service ?? null,
    budget: input.budget ?? null,
    timeline: input.timeline ?? null,
    status: input.status ?? DEFAULT_CRM_LEAD_STATUS,
    source: input.source ?? DEFAULT_CRM_LEAD_SOURCE,
    interest_level: input.interestLevel ?? null,
    completeness_score: input.completenessScore ?? 0,
    detected_services: input.detectedServices ?? [],
  };
}

/**
 * Legt einen Lead an oder aktualisiert ihn anhand der Session-ID.
 */
export async function upsertCrmLead(
  input: CrmLeadUpsertInput
): Promise<CrmLead> {
  assertSupabaseReady();

  const { data: existing, error: fetchError } = await supabaseAdmin!
    .from(CRM_LEADS_TABLE)
    .select("*")
    .eq("session_id", input.sessionId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`CRM Lead laden fehlgeschlagen: ${fetchError.message}`);
  }

  if (existing) {
    const merged = mergeCrmLeadFields(existing as CrmLeadRow, input);
    const { data, error } = await supabaseAdmin!
      .from(CRM_LEADS_TABLE)
      .update(merged)
      .eq("session_id", input.sessionId)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`CRM Lead aktualisieren fehlgeschlagen: ${error?.message}`);
    }

    return mapCrmLeadRow(data as CrmLeadRow);
  }

  const { data, error } = await supabaseAdmin!
    .from(CRM_LEADS_TABLE)
    .insert(toInsertRow(input))
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`CRM Lead anlegen fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmLeadRow(data as CrmLeadRow);
}

/** Liest einen Lead anhand der Chat-Session-ID. */
export async function getCrmLeadBySessionId(
  sessionId: string
): Promise<CrmLead | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_LEADS_TABLE)
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmLeadRow(data as CrmLeadRow);
}

/** Listet Leads für das CRM-Dashboard (optional mit Suche). */
export async function listCrmLeads(
  options: CrmLeadListOptions = {}
): Promise<CrmLead[]> {
  assertSupabaseReady();

  const {
    limit = 200,
    status,
    orderBy = "updated_at",
    ascending = false,
    search,
  } = options;

  let query = supabaseAdmin!
    .from(CRM_LEADS_TABLE)
    .select("*")
    .order(orderBy, { ascending })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  if (search?.trim()) {
    const term = search.trim().replace(/[%_,]/g, "");
    if (term) {
      query = query.or(
        [
          `name.ilike.%${term}%`,
          `company.ilike.%${term}%`,
          `email.ilike.%${term}%`,
          `phone.ilike.%${term}%`,
          `service.ilike.%${term}%`,
        ].join(",")
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`CRM Leads laden fehlgeschlagen: ${error.message}`);
  }

  return (data as CrmLeadRow[]).map(mapCrmLeadRow);
}

/** Liest einen Lead anhand der ID. */
export async function getCrmLeadById(id: string): Promise<CrmLead | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_LEADS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmLeadRow(data as CrmLeadRow);
}

/** Liest den zuletzt aktualisierten Lead anhand der E-Mail-Adresse. */
export async function getCrmLeadByEmail(email: string): Promise<CrmLead | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const normalized = email.trim().toLowerCase();
  const { data, error } = await supabaseAdmin
    .from(CRM_LEADS_TABLE)
    .select("*")
    .ilike("email", normalized)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmLeadRow(data as CrmLeadRow);
}

/** Aktualisiert den Status eines Leads (für späteres Dashboard). */
export async function updateCrmLeadStatus(
  id: string,
  status: CrmLeadStatus
): Promise<CrmLead> {
  assertSupabaseReady();

  const { data, error } = await supabaseAdmin!
    .from(CRM_LEADS_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`CRM Lead-Status aktualisieren fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmLeadRow(data as CrmLeadRow);
}

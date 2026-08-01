/**
 * CRM – Typen
 *
 * Zentrale Datenstruktur für Chat-Leads in der Datenbank.
 * Vorbereitet für späteres CRM-Dashboard (Liste, Filter, Status-Updates).
 */

/** Interner Status-Schlüssel (Datenbank) */
export type CrmLeadStatus =
  | "neu"
  | "in_bearbeitung"
  | "angebot_gesendet"
  | "kunde"
  | "abgelehnt";

/** Quelle des Leads */
export type CrmLeadSource =
  | "assistant"
  | "contact"
  | "quote"
  | "booking"
  | "manual";

/** Lead-Datensatz aus der Datenbank */
export interface CrmLead {
  id: string;
  sessionId: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  status: CrmLeadStatus;
  source: CrmLeadSource;
  interestLevel: string | null;
  completenessScore: number;
  detectedServices: string[];
  createdAt: string;
  updatedAt: string;
}

/** Payload zum Anlegen/Aktualisieren eines Leads */
export interface CrmLeadUpsertInput {
  sessionId: string;
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  status?: CrmLeadStatus;
  source?: CrmLeadSource;
  interestLevel?: string | null;
  completenessScore?: number;
  detectedServices?: string[];
}

/** Filter für Dashboard-Abfragen */
export interface CrmLeadListOptions {
  limit?: number;
  status?: CrmLeadStatus;
  orderBy?: "created_at" | "updated_at";
  ascending?: boolean;
  search?: string;
}

/** Ergebnis einer Sync-Operation */
export interface CrmLeadSyncResult {
  saved: boolean;
  lead: CrmLead | null;
  reason?: "skipped" | "not_configured" | "no_data" | "error";
}

/** Rohe Supabase-Zeile (snake_case) */
export interface CrmLeadRow {
  id: string;
  session_id: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  source: string;
  interest_level: string | null;
  completeness_score: number | null;
  detected_services: string[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Lead-Erkennung – Typen
 *
 * Strukturierte Erfassung erkannter Lead-Informationen pro Session.
 * Vorbereitet für spätere CRM-/Datenbank-Anbindung.
 */

import type { ScoringMessage } from "../lead-scoring/types";

/** Erkannte Kontakt- und Projektinformationen */
export interface DetectedLeadProfile {
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  desiredService: string | null;
  budget: string | null;
  timeline: string | null;
}

export type ServiceInterestLevel = "none" | "curious" | "interested" | "ready";

/** Ergebnis der Lead-Erkennung für eine Session */
export interface LeadDetectionResult {
  sessionId: string;
  profile: DetectedLeadProfile;
  /** True, wenn Interesse an mindestens einer Dienstleistung erkannt wurde */
  hasServiceInterest: boolean;
  serviceInterestLevel: ServiceInterestLevel;
  /** Konkret erkannte Leistungsbereiche (z. B. website, chatbot) */
  detectedServices: string[];
  /** Anteil ausgefüllter Profilfelder (0–100) */
  completenessScore: number;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface LeadDetectionRecord extends LeadDetectionResult {}

export interface LeadDetectionInput {
  sessionId: string;
  messages: ScoringMessage[];
}

/** Lesbare Darstellung für Logs und API-Antwort */
export interface LeadProfileDisplay {
  sessionId: string;
  interesse: boolean;
  interesseLevel: ServiceInterestLevel;
  erkannteLeistungen: string[];
  kontakt: {
    name: string;
    firma: string;
    email: string;
    telefon: string;
  };
  projekt: {
    gewuenschteLeistung: string;
    budget: string;
    zeitrahmen: string;
  };
  vollstaendigkeit: string;
  nachrichten: number;
  aktualisiert: string;
}

/** Felder für Vollständigkeitsberechnung */
export const LEAD_PROFILE_FIELD_KEYS = [
  "name",
  "company",
  "email",
  "phone",
  "desiredService",
  "budget",
  "timeline",
] as const satisfies ReadonlyArray<keyof DetectedLeadProfile>;

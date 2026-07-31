/**
 * Einwandbehandlung – Typdefinitionen
 *
 * Zentraler Typ-Hub. Neue Einwandtypen über ObjectionDefinition registrieren.
 */

import type { ScoringMessage } from "../lead-scoring/types";

/** Bekannte Einwandtypen – erweiterbar. */
export type ObjectionType =
  | "too_expensive"
  | "need_to_think"
  | "compare_offers"
  | "no_budget"
  | "not_needed_now"
  | "already_has_website"
  | "uncertain"
  | "bad_experiences"
  | "need_to_consult_team"
  | "do_later"
  | "no_time";

/** Menschenlesbare Labels (intern / CRM). */
export const OBJECTION_TYPE_LABELS: Record<ObjectionType, string> = {
  too_expensive: "Preis zu hoch",
  need_to_think: "Muss nachdenken",
  compare_offers: "Angebote vergleichen",
  no_budget: "Kein Budget",
  not_needed_now: "Gerade nicht benötigt",
  already_has_website: "Hat bereits Website",
  uncertain: "Noch unsicher",
  bad_experiences: "Schlechte Erfahrungen",
  need_to_consult_team: "Muss mit Partner/Team sprechen",
  do_later: "Später machen",
  no_time: "Keine Zeit",
};

/** Modulare Einwand-Definition im Katalog. */
export interface ObjectionDefinition {
  id: ObjectionType;
  label: string;
  /** Erkennungsmuster – mindestens eines muss matchen. */
  patterns: RegExp[];
  /** Priorität bei mehreren Treffern (höher = wichtiger). */
  priority: number;
  /** Kurze Zusammenfassung des Einwands (intern). */
  summaryTemplate: string;
  /** Empathie-Formulierung als Orientierung für die KI. */
  empathyExamples: string[];
  /** Erklärungs-Hinweise – was die KI einordnen soll. */
  explanationHints: string[];
  /** Nutzen- statt Feature-Formulierung (Orientierung, nicht wörtlich). */
  benefitExamples?: string[];
  /** Rückfrage, um den eigentlichen Grund zu verstehen. */
  followUpQuestions: string[];
  /** Sinnvolle nächste Möglichkeit ohne Druck. */
  nextStepOffers: string[];
  /** Fallback, wenn Einwand nicht auflösbar. */
  unresolvedFallback: string[];
}

/** Erkannter Einwand mit Konfidenz. */
export interface DetectedObjection {
  type: ObjectionType;
  label: string;
  confidence: number;
  matchedText: string;
  isActive: boolean;
}

/** Ergebnis der Einwand-Analyse (intern). */
export interface ObjectionHandlingResult {
  sessionId: string;
  detected: DetectedObjection[];
  primary: DetectedObjection | null;
  messageCount: number;
  updatedAt: string;
}

/** Persistierter Datensatz (CRM-/Dashboard-ready). */
export interface ObjectionHandlingRecord extends ObjectionHandlingResult {
  createdAt: string;
}

/** Pipeline-Eingabe. */
export interface ObjectionHandlingInput {
  sessionId: string;
  messages: ScoringMessage[];
}

/** Pipeline-Ergebnis inkl. internem Prompt. */
export interface ObjectionHandlingPipelineResult {
  result: ObjectionHandlingResult;
  record: ObjectionHandlingRecord;
  objectionPrompt: string;
}

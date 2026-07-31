/**
 * Projektbriefing – Typdefinitionen
 *
 * Modulare Datenstruktur für CRM, PDF, Dashboard und Projektakten.
 * Neue Felder: in fields/catalog.ts registrieren.
 */

import type { ScoringMessage } from "../lead-scoring/types";

/** Einzelnes Briefing-Feld mit extrahiertem Wert. */
export interface BriefingFieldValue {
  id: string;
  label: string;
  value: string | null;
  category: BriefingCategory;
  filled: boolean;
}

export type BriefingCategory =
  | "client"
  | "project"
  | "requirements"
  | "commercial"
  | "context";

/** Strukturiertes Projektbriefing (intern). */
export interface ProjectBriefing {
  sessionId: string;
  client: ClientSection;
  project: ProjectSection;
  requirements: RequirementsSection;
  commercial: CommercialSection;
  context: ContextSection;
  confidenceScore: number;
  missingFields: string[];
  messageCount: number;
  updatedAt: string;
}

export interface ClientSection {
  companyName: string | null;
  contactPerson: string | null;
  industry: string | null;
  companySize: string | null;
  location: string | null;
}

export interface ProjectSection {
  mainGoals: string[];
  currentProblems: string[];
  targetAudience: string | null;
}

export interface RequirementsSection {
  desiredFeatures: string[];
  designWishes: string | null;
  integrations: string[];
  specialRequirements: string[];
  colorPreferences: string | null;
  hasLogo: string | null;
  hasDomain: string | null;
}

export interface CommercialSection {
  budget: string | null;
  timeline: string | null;
}

export interface ContextSection {
  competition: string | null;
  marketingChannels: string[];
  existingWebsite: string | null;
}

/** Modulare Briefing-Sektion für Export (PDF, CRM, Dashboard). */
export interface BriefingExportSection {
  id: string;
  title: string;
  fields: Array<{ label: string; value: string }>;
}

/** Vollständiges Export-Dokument. */
export interface BriefingDocument {
  sessionId: string;
  title: string;
  confidenceScore: number;
  missingFields: string[];
  sections: BriefingExportSection[];
  generatedAt: string;
}

/** Persistierter Datensatz. */
export interface ProjectBriefingRecord extends ProjectBriefing {
  document: BriefingDocument;
  createdAt: string;
}

/** Pipeline-Eingabe. */
export interface ProjectBriefingInput {
  sessionId: string;
  messages: ScoringMessage[];
}

/** Pipeline-Ergebnis. */
export interface ProjectBriefingPipelineResult {
  result: ProjectBriefing;
  record: ProjectBriefingRecord;
  briefingPrompt: string;
}

/** Feld-Definition im Katalog – erweiterbar. */
export interface BriefingFieldDefinition {
  id: string;
  label: string;
  category: BriefingCategory;
  /** Gewicht für Confidence-Score (Summe aller = 100). */
  weight: number;
  /** Priorität zum Nachfragen (höher = wichtiger). */
  askPriority: number;
  /** Extraktion aus Gesprächstext. */
  extract: (text: string, messages: ScoringMessage[]) => string | null;
}

/** Confidence-Ergebnis. */
export interface ConfidenceResult {
  score: number;
  filledWeight: number;
  totalWeight: number;
  missingFields: string[];
  missingLabels: string[];
}

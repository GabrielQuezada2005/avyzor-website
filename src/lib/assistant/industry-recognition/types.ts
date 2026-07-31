/**
 * Branchenerkennung – Typdefinitionen
 */

import type { ScoringMessage } from "../lead-scoring/types";

/** Unterstützte Branchen-IDs – erweiterbar über catalog/industries.ts */
export type IndustryId =
  | "elektriker"
  | "sanitaer"
  | "heizung"
  | "dachdecker"
  | "maler"
  | "schreiner"
  | "garten"
  | "kfz-werkstatt"
  | "autohaus"
  | "restaurant"
  | "cafe"
  | "hotel"
  | "zahnarzt"
  | "arzt"
  | "physiotherapie"
  | "fitness"
  | "friseur"
  | "kosmetik"
  | "anwalt"
  | "steuerberater"
  | "immobilien"
  | "architekt"
  | "unternehmensberatung"
  | "software"
  | "ecommerce"
  | "coaching"
  | "fotograf"
  | "event"
  | "versicherung"
  | "finanzberatung"
  | "handwerk";

export type IndustryDetectionStatus = "detected" | "uncertain" | "unknown";

/** Grobe Kategorie für Paket-/Add-on-Matching im Empfehlungssystem. */
export type RecommendationCategory =
  | "handwerk"
  | "friseur"
  | "gastro"
  | "fitness"
  | "immobilien"
  | "medtech"
  | "fintech"
  | "beratung"
  | "agentur"
  | "ecommerce";

export interface IndustryDefinition {
  id: IndustryId;
  label: string;
  keywords: RegExp[];
  recommendationCategory: RecommendationCategory;
  /** Branchenspezifische Lösungen – Prioritäten für die Beratung. */
  priorities: string[];
  /** Kurzer Beratungskontext für die KI. */
  contextHint: string;
}

export interface IndustryMatch {
  id: IndustryId;
  label: string;
  confidence: number;
  matchedKeywords: string[];
}

export interface IndustryRecognitionResult {
  sessionId: string;
  status: IndustryDetectionStatus;
  primary: IndustryMatch | null;
  alternatives: IndustryMatch[];
  recommendationCategory: RecommendationCategory | null;
  messageCount: number;
  updatedAt: string;
}

export interface IndustryRecognitionRecord extends IndustryRecognitionResult {
  createdAt: string;
}

export interface IndustryRecognitionInput {
  sessionId: string;
  messages: ScoringMessage[];
}

export interface IndustryRecognitionPipelineResult {
  result: IndustryRecognitionResult;
  record: IndustryRecognitionRecord;
  industryPrompt: string;
}

/**
 * Empfehlungssystem – Typdefinitionen
 *
 * Zentraler Typ-Hub für Paket- und Zusatzleistungs-Empfehlungen.
 */

import type { LeadCategory, LeadScoreResult, ScoringMessage } from "../lead-scoring/types";

/** Erkannte Kundenbedürfnisse aus dem Gespräch. */
export interface CustomerNeeds {
  goals: string[];
  features: DetectedFeature[];
  growthPotential: GrowthPotential;
  industry: string | null;
}

export type DetectedFeature =
  | "website"
  | "terminbuchung"
  | "chatbot"
  | "seo"
  | "crm"
  | "automatisierung"
  | "google-ads"
  | "whatsapp"
  | "hosting"
  | "wartung"
  | "performance"
  | "ecommerce";

export type GrowthPotential = "none" | "low" | "medium" | "high";

/** Empfohlenes Hauptpaket oder individuelle Lösung. */
export interface PackageRecommendation {
  type: "package" | "individual";
  packageId: string | null;
  packageName: string;
  price: number | null;
  fitScore: number;
  reasons: string[];
  valueProposition: string;
}

/** Empfohlene Zusatzleistung. */
export interface AddOnRecommendation {
  id: string;
  name: string;
  reasons: string[];
  relevanceScore: number;
}

/** Vollständiges Empfehlungsergebnis (intern). */
export interface RecommendationResult {
  sessionId: string;
  leadScore: number;
  leadCategory: LeadCategory;
  needs: CustomerNeeds;
  primary: PackageRecommendation;
  addOns: AddOnRecommendation[];
  shouldRecommend: boolean;
  updatedAt: string;
}

/** Persistierter Empfehlungs-Datensatz (CRM-/Dashboard-ready). */
export interface RecommendationRecord extends RecommendationResult {
  createdAt: string;
}

/** Input für die Empfehlungs-Pipeline. */
export interface RecommendationInput {
  sessionId: string;
  messages: ScoringMessage[];
  leadScoreResult: LeadScoreResult;
}

/** Modulares Paket-Profil für Matching. */
export interface PackageProfile {
  id: string;
  name: string;
  price: number;
  maxBudgetSignal: string[];
  minCompanySize: string[];
  features: DetectedFeature[];
  industries: string[];
  growthFit: GrowthPotential[];
  idealFor: string[];
}

/** Modulare Zusatzleistung im Katalog. */
export interface AddOnDefinition {
  id: string;
  name: string;
  feature: DetectedFeature;
  keywords: RegExp[];
  industries?: string[];
  minLeadScore?: number;
  reasonTemplates: string[];
  /** Paket-IDs, in denen diese Leistung bereits enthalten ist. */
  includedInPackages: string[];
}

/** Pipeline-Ergebnis inkl. internem Prompt. */
export interface RecommendationPipelineResult {
  result: RecommendationResult;
  record: RecommendationRecord;
  recommendationPrompt: string;
}

/**
 * Lead-Scoring – Typdefinitionen
 *
 * Zentraler Typ-Hub für das interne Lead-Scoring-System.
 * Erweiterbar: neue Faktoren über ScoringFactor registrieren.
 */

/** Lead-Kategorie basierend auf dem Score (0–100). */
export type LeadCategory =
  | "low"
  | "interested"
  | "high"
  | "premium";

/** Menschenlesbare Kategorie-Labels (intern / CRM). */
export const LEAD_CATEGORY_LABELS: Record<LeadCategory, string> = {
  low: "Niedrige Kaufwahrscheinlichkeit",
  interested: "Interessiert",
  high: "Hohe Kaufwahrscheinlichkeit",
  premium: "Sehr hoher Premium-Lead",
};

/** Score-Bereiche pro Kategorie. */
export const LEAD_CATEGORY_RANGES: Record<
  LeadCategory,
  { min: number; max: number }
> = {
  low: { min: 0, max: 25 },
  interested: { min: 26, max: 50 },
  high: { min: 51, max: 75 },
  premium: { min: 76, max: 100 },
};

/** Extrahierte Signale aus dem Gespräch (Rohdaten für Scoring). */
export interface LeadSignals {
  budget: BudgetSignal;
  companySize: CompanySizeSignal;
  industry: IndustrySignal;
  services: ServicesSignal;
  timeframe: TimeframeSignal;
  purchaseInterest: PurchaseInterestSignal;
  urgency: UrgencySignal;
  responseBehavior: ResponseBehaviorSignal;
}

export type BudgetSignal =
  | "none"
  | "asked_about_price"
  | "low_budget"
  | "medium_budget"
  | "high_budget"
  | "premium_budget";

export type CompanySizeSignal =
  | "unknown"
  | "solo"
  | "small"
  | "medium"
  | "large";

export type IndustrySignal = "unknown" | "mentioned" | "specific";

export type ServicesSignal = "none" | "vague" | "specific" | "multiple";

export type TimeframeSignal =
  | "unknown"
  | "exploring"
  | "months"
  | "weeks"
  | "immediate";

export type PurchaseInterestSignal =
  | "browsing"
  | "curious"
  | "evaluating"
  | "ready";

export type UrgencySignal = "none" | "low" | "medium" | "high";

export interface ResponseBehaviorSignal {
  messageCount: number;
  avgMessageLength: number;
  answersQuestions: boolean;
  asksFollowUps: boolean;
}

/** Ergebnis eines einzelnen Scoring-Faktors. */
export interface FactorScore {
  id: string;
  label: string;
  score: number;
  maxScore: number;
}

/**
 * Ein erweiterbarer Scoring-Faktor.
 * Neue Faktoren: implementieren, in FACTORS registrieren – fertig.
 */
export interface ScoringFactor {
  id: string;
  label: string;
  maxScore: number;
  evaluate: (signals: LeadSignals) => number;
}

/** Vollständiges Lead-Scoring-Ergebnis (intern, nie an Nutzer). */
export interface LeadScoreResult {
  sessionId: string;
  score: number;
  category: LeadCategory;
  categoryLabel: string;
  signals: LeadSignals;
  factorBreakdown: FactorScore[];
  messageCount: number;
  updatedAt: string;
}

/** Persistierter Lead-Score-Datensatz (CRM-/Dashboard-ready). */
export interface LeadScoreRecord extends LeadScoreResult {
  createdAt: string;
}

/** Nachrichtenformat für die Signal-Analyse. */
export interface ScoringMessage {
  role: "user" | "assistant";
  content: string;
}

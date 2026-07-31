/**
 * Persönlichkeitsanalyse – Typdefinitionen
 *
 * Zentraler Typ-Hub. Neue Profile über PersonalityProfileDefinition registrieren.
 */

import type { ScoringMessage } from "../lead-scoring/types";

/** Kommunikationsprofile – erweiterbar. */
export type PersonalityProfileType =
  | "analytical"
  | "technical"
  | "business"
  | "price_oriented"
  | "cautious"
  | "decisive"
  | "emotional"
  | "curious"
  | "hurried"
  | "premium";

export const PERSONALITY_PROFILE_LABELS: Record<PersonalityProfileType, string> =
  {
    analytical: "Analytisch",
    technical: "Technisch",
    business: "Geschäftlich",
    price_oriented: "Preisorientiert",
    cautious: "Vorsichtig",
    decisive: "Entscheidungsfreudig",
    emotional: "Emotional",
    curious: "Neugierig",
    hurried: "Eilig",
    premium: "Premium-orientiert",
  };

/** Kommunikationsmerkmale aus dem Gespräch. */
export interface CommunicationTraits {
  writingStyle: "formal" | "neutral" | "informal";
  avgSentenceLength: "short" | "medium" | "long";
  vocabulary: "simple" | "business" | "technical";
  politeness: "high" | "medium" | "low";
  expertise: "novice" | "intermediate" | "expert";
  decisionBehavior: "cautious" | "balanced" | "decisive";
  budgetOrientation: "price" | "balanced" | "premium";
  questionDetail: "shallow" | "moderate" | "deep";
  decisionSpeed: "slow" | "medium" | "fast";
  tone: "emotional" | "neutral" | "factual";
}

/** Profil-Zuordnung mit Konfidenz. */
export interface AssignedProfile {
  type: PersonalityProfileType;
  label: string;
  confidence: number;
}

/** Modulare Profil-Definition mit Anpassungsregeln. */
export interface PersonalityProfileDefinition {
  id: PersonalityProfileType;
  label: string;
  /** Scoring-Funktion basierend auf Merkmalen und Text. */
  scoreTraits: (traits: CommunicationTraits, text: string) => number;
  /** Anpassungsregeln für die KI (intern). */
  adaptations: PersonalityAdaptations;
}

/** Wie die KI ihre Kommunikation anpassen soll. */
export interface PersonalityAdaptations {
  tone: string;
  wordChoice: string;
  detailDepth: string;
  responseLength: string;
  followUpCount: string;
  salesStrategy: string;
  explanationDepth: string;
  conversationPace: string;
}

/** Vollständiges Analyseergebnis (intern). */
export interface PersonalityAnalysisResult {
  sessionId: string;
  traits: CommunicationTraits;
  profiles: AssignedProfile[];
  primary: AssignedProfile | null;
  secondary: AssignedProfile | null;
  messageCount: number;
  updatedAt: string;
}

/** Persistierter Datensatz (CRM-/Dashboard-ready). */
export interface PersonalityAnalysisRecord extends PersonalityAnalysisResult {
  createdAt: string;
}

/** Pipeline-Eingabe. */
export interface PersonalityAnalysisInput {
  sessionId: string;
  messages: ScoringMessage[];
}

/** Pipeline-Ergebnis inkl. internem Prompt. */
export interface PersonalityAnalysisPipelineResult {
  result: PersonalityAnalysisResult;
  record: PersonalityAnalysisRecord;
  personalityPrompt: string;
}

/** Mindest-Konfidenz für Profil-Zuordnung. */
export const MIN_PROFILE_CONFIDENCE = 0.35;

/** Maximal zugeordnete Profile. */
export const MAX_ASSIGNED_PROFILES = 3;

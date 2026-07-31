/**
 * Lead-Scoring – Faktoren-Registry
 *
 * Jeder Faktor analysiert ein Signal und liefert 0–maxScore Punkte.
 * Neue Faktoren: Datei anlegen, hier registrieren.
 */

import type { LeadSignals, ScoringFactor } from "../types";

function scoreBudget(signals: LeadSignals): number {
  const map: Record<LeadSignals["budget"], number> = {
    none: 0,
    asked_about_price: 8,
    low_budget: 5,
    medium_budget: 14,
    high_budget: 18,
    premium_budget: 20,
  };
  return map[signals.budget];
}

function scoreCompanySize(signals: LeadSignals): number {
  const map: Record<LeadSignals["companySize"], number> = {
    unknown: 0,
    solo: 3,
    small: 6,
    medium: 8,
    large: 10,
  };
  return map[signals.companySize];
}

function scoreIndustry(signals: LeadSignals): number {
  const map: Record<LeadSignals["industry"], number> = {
    unknown: 0,
    mentioned: 3,
    specific: 5,
  };
  return map[signals.industry];
}

function scoreServices(signals: LeadSignals): number {
  const map: Record<LeadSignals["services"], number> = {
    none: 0,
    vague: 5,
    specific: 12,
    multiple: 15,
  };
  return map[signals.services];
}

function scoreTimeframe(signals: LeadSignals): number {
  const map: Record<LeadSignals["timeframe"], number> = {
    unknown: 0,
    exploring: 3,
    months: 8,
    weeks: 12,
    immediate: 15,
  };
  return map[signals.timeframe];
}

function scorePurchaseInterest(signals: LeadSignals): number {
  const map: Record<LeadSignals["purchaseInterest"], number> = {
    browsing: 2,
    curious: 8,
    evaluating: 14,
    ready: 20,
  };
  return map[signals.purchaseInterest];
}

function scoreUrgency(signals: LeadSignals): number {
  const map: Record<LeadSignals["urgency"], number> = {
    none: 0,
    low: 3,
    medium: 6,
    high: 10,
  };
  return map[signals.urgency];
}

function scoreResponseBehavior(signals: LeadSignals): number {
  const { responseBehavior: rb } = signals;
  let score = 0;

  if (rb.messageCount >= 2) score += 1;
  if (rb.messageCount >= 4) score += 1;
  if (rb.avgMessageLength >= 40) score += 1;
  if (rb.answersQuestions) score += 1;
  if (rb.asksFollowUps) score += 1;

  return Math.min(score, 5);
}

/** Alle registrierten Scoring-Faktoren (Summe maxScore = 100). */
export const SCORING_FACTORS: ScoringFactor[] = [
  { id: "budget", label: "Budget", maxScore: 20, evaluate: scoreBudget },
  {
    id: "companySize",
    label: "Unternehmensgröße",
    maxScore: 10,
    evaluate: scoreCompanySize,
  },
  { id: "industry", label: "Branche", maxScore: 5, evaluate: scoreIndustry },
  {
    id: "services",
    label: "Gewünschte Leistungen",
    maxScore: 15,
    evaluate: scoreServices,
  },
  {
    id: "timeframe",
    label: "Zeitrahmen",
    maxScore: 15,
    evaluate: scoreTimeframe,
  },
  {
    id: "purchaseInterest",
    label: "Kaufinteresse",
    maxScore: 20,
    evaluate: scorePurchaseInterest,
  },
  { id: "urgency", label: "Dringlichkeit", maxScore: 10, evaluate: scoreUrgency },
  {
    id: "responseBehavior",
    label: "Antwortverhalten",
    maxScore: 5,
    evaluate: scoreResponseBehavior,
  },
];

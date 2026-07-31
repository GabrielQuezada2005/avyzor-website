/**
 * Lead-Scoring – Score-Berechnung
 *
 * Aggregiert Faktor-Scores zu einem Gesamtscore (0–100) und einer Kategorie.
 */

import { analyzeLeadSignals } from "./analyzer";
import { SCORING_FACTORS } from "./factors";
import type {
  FactorScore,
  LeadCategory,
  LeadScoreResult,
  ScoringMessage,
} from "./types";
import { LEAD_CATEGORY_LABELS, LEAD_CATEGORY_RANGES } from "./types";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Ermittelt die Lead-Kategorie anhand des Scores. */
export function scoreToCategory(score: number): LeadCategory {
  if (score >= LEAD_CATEGORY_RANGES.premium.min) return "premium";
  if (score >= LEAD_CATEGORY_RANGES.high.min) return "high";
  if (score >= LEAD_CATEGORY_RANGES.interested.min) return "interested";
  return "low";
}

function calculateFactorBreakdown(
  signals: ReturnType<typeof analyzeLeadSignals>
): FactorScore[] {
  return SCORING_FACTORS.map((factor) => ({
    id: factor.id,
    label: factor.label,
    score: factor.evaluate(signals),
    maxScore: factor.maxScore,
  }));
}

/**
 * Berechnet den vollständigen Lead-Score aus dem Gesprächsverlauf.
 * Wird bei jeder Nachricht neu aufgerufen – Score aktualisiert sich automatisch.
 */
export function calculateLeadScore(
  sessionId: string,
  messages: ScoringMessage[]
): LeadScoreResult {
  const signals = analyzeLeadSignals(messages);
  const factorBreakdown = calculateFactorBreakdown(signals);
  const rawScore = factorBreakdown.reduce((sum, f) => sum + f.score, 0);
  const score = clampScore(rawScore);
  const category = scoreToCategory(score);

  return {
    sessionId,
    score,
    category,
    categoryLabel: LEAD_CATEGORY_LABELS[category],
    signals,
    factorBreakdown,
    messageCount: messages.filter((m) => m.role === "user").length,
    updatedAt: new Date().toISOString(),
  };
}

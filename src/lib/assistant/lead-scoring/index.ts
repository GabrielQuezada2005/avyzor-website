/**
 * Lead-Scoring – Öffentliche API
 *
 * Zentrale Entry-Point-Funktion für die Integration in die Assistant-Route.
 */

import { buildLeadBehaviorPrompt } from "./behavior";
import { calculateLeadScore } from "./calculator";
import { saveLeadScore } from "./store";
import type { LeadScoreRecord, LeadScoreResult, ScoringMessage } from "./types";

export type {
  FactorScore,
  LeadCategory,
  LeadScoreRecord,
  LeadScoreResult,
  LeadSignals,
  ScoringMessage,
  ScoringFactor,
} from "./types";

export type { LeadScorePersistenceAdapter } from "./store";

export {
  LEAD_CATEGORY_LABELS,
  LEAD_CATEGORY_RANGES,
} from "./types";

export { analyzeLeadSignals } from "./analyzer";
export { calculateLeadScore, scoreToCategory } from "./calculator";
export { buildLeadBehaviorPrompt } from "./behavior";
export {
  getLeadScore,
  getLeadScoreCount,
  listLeadScores,
  registerLeadScorePersistence,
  saveLeadScore,
} from "./store";
export { SCORING_FACTORS } from "./factors";

export interface LeadScoringPipelineResult {
  scoreResult: LeadScoreResult;
  record: LeadScoreRecord;
  behaviorPrompt: string;
}

/**
 * Führt die komplette Lead-Scoring-Pipeline aus:
 * 1. Signale analysieren
 * 2. Score berechnen (0–100)
 * 3. Intern speichern
 * 4. Verhaltens-Prompt für die KI erzeugen
 *
 * Der Score wird niemals an den Nutzer zurückgegeben.
 */
export function processLeadScoring(
  sessionId: string,
  messages: ScoringMessage[]
): LeadScoringPipelineResult {
  const scoreResult = calculateLeadScore(sessionId, messages);
  const record = saveLeadScore(scoreResult);
  const behaviorPrompt = buildLeadBehaviorPrompt(scoreResult);

  return { scoreResult, record, behaviorPrompt };
}

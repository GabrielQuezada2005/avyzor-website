/**
 * Proaktive Beratung – Öffentliche API
 *
 * Pipeline: Lücken priorisieren → Chancen/Risiken erkennen → Prompt erzeugen
 */

import { detectOpportunities } from "./opportunities";
import { prioritizeGaps, selectNextQuestion } from "./gap-prioritizer";
import { buildProactiveConsultationPrompt } from "./prompt";
import { detectRisks } from "./risks";
import type {
  ProactiveConsultationInput,
  ProactiveConsultationPipelineResult,
  ProactiveConsultationResult,
} from "./types";

export type {
  DetectedOpportunity,
  DetectedRisk,
  OpportunityId,
  PrioritizedGap,
  ProactiveConsultationInput,
  ProactiveConsultationPipelineResult,
  ProactiveConsultationResult,
  RiskId,
} from "./types";

export { detectOpportunities } from "./opportunities";
export { detectRisks } from "./risks";
export { prioritizeGaps, selectNextQuestion } from "./gap-prioritizer";
export { buildProactiveConsultationPrompt } from "./prompt";

/**
 * Führt die proaktive Beratungs-Pipeline aus.
 */
export function processProactiveConsultation(
  input: ProactiveConsultationInput
): ProactiveConsultationPipelineResult {
  const { sessionId, messages, briefing, industryLabel } = input;

  const messageCount = messages.filter((m) => m.role === "user").length;
  const opportunities = detectOpportunities(messages);
  const risks = detectRisks(messages, briefing, industryLabel);
  const prioritizedGaps = prioritizeGaps(briefing, industryLabel);
  const nextQuestion = selectNextQuestion(prioritizedGaps, messageCount);

  const result: ProactiveConsultationResult = {
    sessionId,
    opportunities,
    risks,
    prioritizedGaps,
    nextQuestion,
    messageCount,
    updatedAt: new Date().toISOString(),
  };

  const proactivePrompt = buildProactiveConsultationPrompt(result, briefing);

  return { result, proactivePrompt };
}

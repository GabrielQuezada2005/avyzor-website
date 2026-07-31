/**
 * Persönlichkeitsanalyse – Öffentliche API
 *
 * Pipeline: Merkmale analysieren → Profile zuordnen → Prompt erzeugen
 */

import { buildPersonalityPrompt } from "./prompt";
import {
  assignProfiles,
  getPrimaryProfile,
  getSecondaryProfile,
} from "./profiler";
import { savePersonalityAnalysis } from "./store";
import { analyzeCommunicationTraits } from "./traits-analyzer";
import type {
  PersonalityAnalysisInput,
  PersonalityAnalysisPipelineResult,
  PersonalityAnalysisResult,
} from "./types";

export type {
  AssignedProfile,
  CommunicationTraits,
  PersonalityAdaptations,
  PersonalityAnalysisInput,
  PersonalityAnalysisPipelineResult,
  PersonalityAnalysisRecord,
  PersonalityAnalysisResult,
  PersonalityProfileDefinition,
  PersonalityProfileType,
} from "./types";

export type { PersonalityPersistenceAdapter } from "./store";

export {
  MIN_PROFILE_CONFIDENCE,
  MAX_ASSIGNED_PROFILES,
  PERSONALITY_PROFILE_LABELS,
} from "./types";

export { PERSONALITY_PROFILE_CATALOG } from "./catalog/profiles";
export { analyzeCommunicationTraits } from "./traits-analyzer";
export {
  assignProfiles,
  getPrimaryProfile,
  getSecondaryProfile,
  mergeAdaptations,
} from "./profiler";
export { buildPersonalityPrompt } from "./prompt";
export {
  getPersonalityAnalysis,
  listPersonalityAnalyses,
  registerPersonalityPersistence,
  savePersonalityAnalysis,
} from "./store";

/**
 * Führt die Persönlichkeitsanalyse-Pipeline aus.
 * Ergebnis und Prompt sind intern – der Nutzer sieht sie nie direkt.
 */
export function processPersonalityAnalysis(
  input: PersonalityAnalysisInput
): PersonalityAnalysisPipelineResult {
  const { sessionId, messages } = input;

  const traits = analyzeCommunicationTraits(messages);
  const text = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  const profiles = assignProfiles(traits, text);
  const primary = getPrimaryProfile(profiles);
  const secondary = getSecondaryProfile(profiles);

  const result: PersonalityAnalysisResult = {
    sessionId,
    traits,
    profiles,
    primary,
    secondary,
    messageCount: messages.filter((m) => m.role === "user").length,
    updatedAt: new Date().toISOString(),
  };

  const record = savePersonalityAnalysis(result);
  const personalityPrompt = buildPersonalityPrompt(result);

  return { result, record, personalityPrompt };
}

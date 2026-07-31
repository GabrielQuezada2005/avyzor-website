/**
 * Empfehlungssystem – Öffentliche API
 *
 * Pipeline: Bedürfnisse analysieren → Paket matchen → Add-ons matchen → Prompt erzeugen
 */

import { matchAddOns } from "./addon-matcher";
import { analyzeCustomerNeeds } from "./needs-analyzer";
import { matchPackage } from "./package-matcher";
import {
  buildRecommendationPrompt,
  shouldGenerateRecommendation,
} from "./prompt";
import { saveRecommendation } from "./store";
import type {
  RecommendationInput,
  RecommendationPipelineResult,
  RecommendationResult,
} from "./types";

export type {
  AddOnRecommendation,
  AddOnDefinition,
  CustomerNeeds,
  DetectedFeature,
  PackageProfile,
  PackageRecommendation,
  RecommendationInput,
  RecommendationPipelineResult,
  RecommendationRecord,
  RecommendationResult,
} from "./types";

export type { RecommendationPersistenceAdapter } from "./store";

export { ADDON_CATALOG } from "./catalog/addons";
export { PACKAGE_PROFILES, MIN_PACKAGE_FIT_SCORE } from "./catalog/packages";
export { analyzeCustomerNeeds } from "./needs-analyzer";
export { matchPackage } from "./package-matcher";
export { matchAddOns } from "./addon-matcher";
export { buildRecommendationPrompt, shouldGenerateRecommendation } from "./prompt";
export {
  getRecommendation,
  listRecommendations,
  registerRecommendationPersistence,
  saveRecommendation,
} from "./store";

/**
 * Führt die komplette Empfehlungs-Pipeline aus.
 * Ergebnis und Prompt sind intern – der Nutzer sieht sie nie direkt.
 */
export function processRecommendations(
  input: RecommendationInput
): RecommendationPipelineResult {
  const { sessionId, messages, leadScoreResult } = input;

  const needs = analyzeCustomerNeeds(messages, leadScoreResult.signals);
  const shouldRecommend = shouldGenerateRecommendation(
    leadScoreResult.messageCount,
    leadScoreResult.score
  );

  const primary = shouldRecommend
    ? matchPackage(needs, leadScoreResult)
    : {
        type: "individual" as const,
        packageId: null,
        packageName: "Noch nicht bestimmt",
        price: null,
        fitScore: 0,
        reasons: ["Noch nicht genug Kontext"],
        valueProposition: "",
      };

  const addOns =
    shouldRecommend && primary.type === "package"
      ? matchAddOns(needs, primary, leadScoreResult, messages)
      : shouldRecommend && primary.type === "individual"
        ? matchAddOns(
            needs,
            { ...primary, packageId: "" },
            leadScoreResult,
            messages
          )
        : [];

  const result: RecommendationResult = {
    sessionId,
    leadScore: leadScoreResult.score,
    leadCategory: leadScoreResult.category,
    needs,
    primary,
    addOns,
    shouldRecommend,
    updatedAt: new Date().toISOString(),
  };

  const record = saveRecommendation(result);
  const recommendationPrompt = buildRecommendationPrompt(result);

  return { result, record, recommendationPrompt };
}

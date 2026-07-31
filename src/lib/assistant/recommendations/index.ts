/**
 * Empfehlungssystem – Öffentliche API
 *
 * Pipeline: Bedürfnisse analysieren → Paket matchen → Add-ons matchen → Prompt erzeugen
 */

import { matchAddOns } from "./addon-matcher";
import { analyzeCustomerNeeds } from "./needs-analyzer";
import { buildOfferAnalysis } from "./offer-builder";
import { matchPackagesWithAlternatives } from "./package-matcher";
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
  OfferAnalysis,
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
export { buildOfferAnalysis } from "./offer-builder";
export { matchPackage, matchPackagesWithAlternatives } from "./package-matcher";
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
 */
export function processRecommendations(
  input: RecommendationInput
): RecommendationPipelineResult {
  const { sessionId, messages, leadScoreResult, briefing } = input;

  const needs = analyzeCustomerNeeds(messages, leadScoreResult.signals);
  const shouldRecommend = shouldGenerateRecommendation(
    leadScoreResult.messageCount,
    leadScoreResult.score,
    briefing?.confidenceScore
  );

  const { primary, runnerUp, budgetAlternative } = shouldRecommend
    ? matchPackagesWithAlternatives(needs, leadScoreResult)
    : {
        primary: {
          type: "individual" as const,
          packageId: null,
          packageName: "Noch nicht bestimmt",
          price: null,
          fitScore: 0,
          reasons: ["Noch nicht genug Kontext"],
          valueProposition: "",
        },
        runnerUp: null,
        budgetAlternative: null,
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

  const offerAnalysis =
    shouldRecommend && primary.type === "package"
      ? buildOfferAnalysis(
          primary,
          runnerUp,
          budgetAlternative,
          needs,
          leadScoreResult,
          briefing
        )
      : shouldRecommend && primary.type === "individual"
        ? buildOfferAnalysis(
            primary,
            runnerUp,
            budgetAlternative,
            needs,
            leadScoreResult,
            briefing
          )
        : null;

  const result: RecommendationResult = {
    sessionId,
    leadScore: leadScoreResult.score,
    leadCategory: leadScoreResult.category,
    needs,
    primary,
    runnerUp,
    offerAnalysis,
    addOns,
    shouldRecommend,
    updatedAt: new Date().toISOString(),
  };

  const record = saveRecommendation(result);
  const recommendationPrompt = buildRecommendationPrompt(result, briefing);

  return { result, record, recommendationPrompt };
}

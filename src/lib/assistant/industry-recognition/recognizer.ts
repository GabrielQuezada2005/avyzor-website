/**
 * Branchenerkennung – Erkennungslogik
 *
 * Analysiert Nutzernachrichten und ordnet Branchen mit Konfidenz zu.
 */

import {
  INDUSTRY_CATALOG,
  INDUSTRY_BY_ID,
  mapIndustryToRecommendationCategory,
} from "./catalog/industries";
import type {
  IndustryDetectionStatus,
  IndustryId,
  IndustryMatch,
  IndustryRecognitionResult,
  RecommendationCategory,
} from "./types";
import type { ScoringMessage } from "../lead-scoring/types";

const DETECTION_THRESHOLD = 0.5;
const UNCERTAIN_GAP = 0.15;

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

function matchIndustry(text: string): IndustryMatch[] {
  const normalized = text.toLowerCase();
  const matches: IndustryMatch[] = [];

  for (const industry of INDUSTRY_CATALOG) {
    const matchedKeywords: string[] = [];

    for (const pattern of industry.keywords) {
      const match = normalized.match(pattern);
      if (match?.[0]) {
        matchedKeywords.push(match[0]);
      }
    }

    if (matchedKeywords.length === 0) continue;

    const uniqueKeywords = Array.from(new Set(matchedKeywords));
    const confidence = Math.min(1, uniqueKeywords.length * 0.35 + 0.3);

    matches.push({
      id: industry.id,
      label: industry.label,
      confidence,
      matchedKeywords: uniqueKeywords,
    });
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}

function resolveStatus(
  matches: IndustryMatch[]
): IndustryDetectionStatus {
  if (matches.length === 0) return "unknown";

  const top = matches[0];
  if (top.confidence < DETECTION_THRESHOLD) return "unknown";

  if (
    matches.length > 1 &&
    matches[1].confidence >= DETECTION_THRESHOLD &&
    top.confidence - matches[1].confidence < UNCERTAIN_GAP
  ) {
    return "uncertain";
  }

  return "detected";
}

/** Bevorzugt spezifische Branchen gegenüber dem allgemeinen Handwerk-Fallback. */
function preferSpecificIndustry(matches: IndustryMatch[]): IndustryMatch | null {
  if (matches.length === 0) return null;

  const withoutGeneric = matches.filter((m) => m.id !== "handwerk");
  if (withoutGeneric.length > 0) return withoutGeneric[0];

  return matches[0];
}

function resolveStatusAndPrimary(
  matches: IndustryMatch[]
): {
  status: IndustryDetectionStatus;
  primary: IndustryMatch | null;
  alternatives: IndustryMatch[];
} {
  const status = resolveStatus(matches);

  if (status === "unknown") {
    return { status, primary: null, alternatives: [] };
  }

  const primary = preferSpecificIndustry(matches);
  const alternatives = matches
    .filter((m) => m.id !== primary?.id)
    .slice(0, 2);

  return { status, primary, alternatives };
}

/**
 * Erkennt Branche aus dem Gesprächsverlauf.
 */
export function recognizeIndustry(
  sessionId: string,
  messages: ScoringMessage[]
): IndustryRecognitionResult {
  const text = joinUserText(messages);
  const matches = matchIndustry(text);
  const { status, primary, alternatives } = resolveStatusAndPrimary(matches);

  let recommendationCategory: RecommendationCategory | null = null;
  if (primary) {
    recommendationCategory =
      (mapIndustryToRecommendationCategory(
        primary.id
      ) as RecommendationCategory | null) ?? null;
  }

  return {
    sessionId,
    status,
    primary,
    alternatives,
    recommendationCategory,
    messageCount: messages.filter((m) => m.role === "user").length,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Liefert Branchen-Definition für eine erkannte ID.
 */
export function getIndustryDefinition(id: IndustryId) {
  return INDUSTRY_BY_ID[id];
}

/**
 * Für recommendations/ – grobe Branchenkategorie aus Nachrichten.
 */
export function detectRecommendationCategoryFromMessages(
  messages: ScoringMessage[]
): string | null {
  const result = recognizeIndustry("temp", messages);
  return result.recommendationCategory;
}

/**
 * Persönlichkeitsanalyse – Profil-Zuordnung
 *
 * Ordnet Merkmale einem oder mehreren Kommunikationsprofilen zu.
 */

import { PERSONALITY_PROFILE_CATALOG } from "./catalog/profiles";
import type {
  AssignedProfile,
  CommunicationTraits,
  PersonalityProfileType,
} from "./types";
import {
  MAX_ASSIGNED_PROFILES,
  MIN_PROFILE_CONFIDENCE,
  PERSONALITY_PROFILE_LABELS,
} from "./types";

const MAX_TRAIT_SCORE = 100;

function normalizeScore(rawScore: number): number {
  return Math.min(rawScore / MAX_TRAIT_SCORE, 1);
}

/**
 * Ordnet Kommunikationsmerkmale den passenden Profilen zu.
 * Mehrere Profile möglich – primäres und sekundäres Profil.
 */
export function assignProfiles(
  traits: CommunicationTraits,
  text: string
): AssignedProfile[] {
  const scored = PERSONALITY_PROFILE_CATALOG.map((profile) => ({
    type: profile.id,
    label: profile.label,
    confidence: normalizeScore(profile.scoreTraits(traits, text.toLowerCase())),
  }))
    .filter((p) => p.confidence >= MIN_PROFILE_CONFIDENCE)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, MAX_ASSIGNED_PROFILES);

  return scored;
}

export function getPrimaryProfile(
  profiles: AssignedProfile[]
): AssignedProfile | null {
  return profiles[0] ?? null;
}

export function getSecondaryProfile(
  profiles: AssignedProfile[]
): AssignedProfile | null {
  return profiles[1] ?? null;
}

export function getProfileAdaptations(type: PersonalityProfileType) {
  return PERSONALITY_PROFILE_CATALOG.find((p) => p.id === type)?.adaptations ?? null;
}

/** Kombiniert Anpassungen aus primärem und sekundärem Profil. */
export function mergeAdaptations(
  primary: PersonalityProfileType | null,
  secondary: PersonalityProfileType | null
) {
  const primaryAdapt = primary ? getProfileAdaptations(primary) : null;
  const secondaryAdapt = secondary ? getProfileAdaptations(secondary) : null;

  if (!primaryAdapt) return null;

  if (!secondaryAdapt) return primaryAdapt;

  return {
    tone: primaryAdapt.tone,
    wordChoice: secondaryAdapt.wordChoice !== primaryAdapt.wordChoice
      ? `${primaryAdapt.wordChoice}; ${secondaryAdapt.wordChoice}`
      : primaryAdapt.wordChoice,
    detailDepth: primaryAdapt.detailDepth,
    responseLength: primaryAdapt.responseLength,
    followUpCount: primaryAdapt.followUpCount,
    salesStrategy: `${primaryAdapt.salesStrategy}; ${secondaryAdapt.salesStrategy}`,
    explanationDepth: primaryAdapt.explanationDepth,
    conversationPace: primaryAdapt.conversationPace,
  };
}

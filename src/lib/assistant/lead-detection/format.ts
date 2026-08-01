/**
 * Lead-Erkennung – Lesbare Darstellung
 */

import type {
  DetectedLeadProfile,
  LeadDetectionResult,
  LeadProfileDisplay,
} from "./types";

const EMPTY = "—";

function displayValue(value: string | null): string {
  return value?.trim() ? value.trim() : EMPTY;
}

/**
 * Formatiert ein Lead-Profil für Logs und API-Antworten.
 */
export function formatLeadProfileForDisplay(
  result: LeadDetectionResult
): LeadProfileDisplay {
  const { profile } = result;

  return {
    sessionId: result.sessionId,
    interesse: result.hasServiceInterest,
    interesseLevel: result.serviceInterestLevel,
    erkannteLeistungen: result.detectedServices,
    kontakt: {
      name: displayValue(profile.name),
      firma: displayValue(profile.company),
      email: displayValue(profile.email),
      telefon: displayValue(profile.phone),
    },
    projekt: {
      gewuenschteLeistung: displayValue(profile.desiredService),
      budget: displayValue(profile.budget),
      zeitrahmen: displayValue(profile.timeline),
    },
    vollstaendigkeit: `${result.completenessScore}%`,
    nachrichten: result.messageCount,
    aktualisiert: result.updatedAt,
  };
}

/**
 * Kompakte Zusammenfassung der erkannten Felder (nur befüllte Werte).
 */
export function summarizeDetectedFields(
  profile: DetectedLeadProfile
): Partial<Record<keyof DetectedLeadProfile, string>> {
  const summary: Partial<Record<keyof DetectedLeadProfile, string>> = {};

  for (const [key, value] of Object.entries(profile) as Array<
    [keyof DetectedLeadProfile, string | null]
  >) {
    if (value?.trim()) summary[key] = value.trim();
  }

  return summary;
}

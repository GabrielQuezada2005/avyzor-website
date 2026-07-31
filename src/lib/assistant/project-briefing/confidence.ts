/**
 * Projektbriefing – Confidence Score
 *
 * Berechnet, wie vollständig die Projektdaten sind (0–100 %).
 */

import { BRIEFING_FIELD_CATALOG } from "./fields/catalog";
import type { BriefingFieldValue, ConfidenceResult } from "./types";

/**
 * Berechnet den Confidence Score und listet fehlende Felder.
 */
export function calculateConfidence(
  fields: BriefingFieldValue[]
): ConfidenceResult {
  const totalWeight = BRIEFING_FIELD_CATALOG.reduce(
    (sum, f) => sum + f.weight,
    0
  );

  let filledWeight = 0;
  const missingFields: string[] = [];
  const missingLabels: string[] = [];

  for (const fieldDef of BRIEFING_FIELD_CATALOG) {
    const extracted = fields.find((f) => f.id === fieldDef.id);
    if (extracted?.filled) {
      filledWeight += fieldDef.weight;
    } else {
      missingFields.push(fieldDef.id);
      missingLabels.push(fieldDef.label);
    }
  }

  const score = Math.round((filledWeight / totalWeight) * 100);

  return {
    score,
    filledWeight,
    totalWeight,
    missingFields,
    missingLabels,
  };
}

/** Top-N fehlende Felder nach Priorität (für natürliches Nachfragen). */
export function getTopMissingFields(limit = 3): string[] {
  return BRIEFING_FIELD_CATALOG.filter((f) => true)
    .sort((a, b) => b.askPriority - a.askPriority)
    .slice(0, limit)
    .map((f) => f.label);
}

export function getMissingFieldsByPriority(
  missingFieldIds: string[],
  limit = 3
): string[] {
  return BRIEFING_FIELD_CATALOG.filter((f) => missingFieldIds.includes(f.id))
    .sort((a, b) => b.askPriority - a.askPriority)
    .slice(0, limit)
    .map((f) => f.label);
}

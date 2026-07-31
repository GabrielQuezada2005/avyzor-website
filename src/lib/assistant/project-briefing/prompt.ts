/**
 * Projektbriefing – Interner Prompt-Generator
 *
 * Steuert natürliches Nachfragen fehlender Informationen (unsichtbar für Kunde).
 */

import { getMissingFieldsByPriority } from "./confidence";
import type { ProjectBriefing } from "./types";

/** Ab diesem Score keine aktive Nachfrage mehr nötig. */
const COMPLETENESS_TARGET = 85;

/** Mindest-Nachrichten bevor gezielt nachgefragt wird. */
const MIN_MESSAGES_BEFORE_ASK = 3;

/**
 * Erzeugt internen Prompt für Briefing-Sammlung und Nachfragen.
 */
export function buildBriefingPrompt(briefing: ProjectBriefing): string {
  const lines: string[] = [
    "PROJEKTBRIEFING (INTERN – KUNDE SIEHT DIES NICHT):",
    `Datenvollständigkeit: ${briefing.confidenceScore} %`,
    "",
    "Bereits erfasste Informationen (intern nutzen, nicht wiederholen):",
  ];

  const addIf = (label: string, value: string | null | string[]) => {
    if (Array.isArray(value) && value.length > 0) {
      lines.push(`- ${label}: ${value.join(", ")}`);
    } else if (value && !Array.isArray(value)) {
      lines.push(`- ${label}: ${value}`);
    }
  };

  addIf("Firma", briefing.client.companyName);
  addIf("Branche", briefing.client.industry);
  addIf("Ziele", briefing.project.mainGoals);
  addIf("Funktionen", briefing.requirements.desiredFeatures);
  addIf("Budget", briefing.commercial.budget);
  addIf("Zeitrahmen", briefing.commercial.timeline);
  addIf("Website", briefing.context.existingWebsite);

  if (briefing.missingFields.length > 0) {
    const topMissing = getMissingFieldsByPriority(briefing.missingFields, 5);
    lines.push("", "Fehlende Informationen:", ...topMissing.map((f) => `- ${f}`));
  }

  lines.push("", "Anweisungen:");

  if (
    briefing.confidenceScore < COMPLETENESS_TARGET &&
    briefing.messageCount >= MIN_MESSAGES_BEFORE_ASK &&
    briefing.missingFields.length > 0
  ) {
    const nextAsk = getMissingFieldsByPriority(briefing.missingFields, 1)[0];
    lines.push(
      `- Datenvollständigkeit unter ${COMPLETENESS_TARGET} % – fehlende Info nur nebenbei ergänzen, nicht als Formular.`,
      `- Priorität: konkrete Empfehlung geben – nicht nur nach '${nextAsk}' fragen.`,
      "- Fehlende Info nur einweben, wenn es natürlich passt und keine Empfehlung blockiert.",
      "- Niemals mehrere fehlende Felder auf einmal abfragen."
    );
  } else if (briefing.confidenceScore >= COMPLETENESS_TARGET) {
    lines.push(
      "- Briefing weitgehend vollständig – Fokus auf Beratung und nächste Schritte.",
      "- Keine weiteren Daten-Fragen nötig, es sei denn der Kunde bringt Neues ein."
    );
  } else {
    lines.push(
      "- Noch früh im Gespräch – erst Vertrauen aufbauen, dann gezielt Informationen sammeln.",
      "- Keine Formular-Fragen stellen."
    );
  }

  lines.push(
    "",
    "- Briefing, Confidence Score und fehlende Felder niemals dem Kunden zeigen.",
    "- Bereits erfasste Informationen nicht erneut abfragen."
  );

  return lines.join("\n");
}

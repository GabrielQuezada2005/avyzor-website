/**
 * Branchenerkennung – Interner Prompt-Generator
 */

import { INDUSTRY_BY_ID } from "./catalog/industries";
import type { IndustryRecognitionResult } from "./types";

const DISCOVERY_QUESTIONS = [
  "In welcher Branche sind Sie tätig – Handwerk, Gastronomie, Gesundheit oder Dienstleistung?",
  "Was für ein Unternehmen führen Sie – damit ich gezielt beraten kann?",
  "Welche Branche beschreibt Ihr Geschäft am besten?",
];

function pickDiscoveryQuestion(messageCount: number): string {
  return DISCOVERY_QUESTIONS[messageCount % DISCOVERY_QUESTIONS.length];
}

function buildDetectedPrompt(result: IndustryRecognitionResult): string {
  const industry = result.primary!;
  const definition = INDUSTRY_BY_ID[industry.id];

  const lines: string[] = [
    "BRANCHENERKENNUNG (INTERN – NUTZER SIEHT DIES NICHT):",
    `Erkannte Branche: ${definition.label} (Konfidenz: ${Math.round(industry.confidence * 100)} %)`,
    "",
    "Beratungskontext:",
    definition.contextHint,
    "",
    "Branchenspezifische Prioritäten (in Empfehlungen einbeziehen):",
    ...definition.priorities.map((p) => `- ${p}`),
    "",
    "Anweisungen:",
    "- Berate branchenspezifisch – nicht nur allgemeine Website-Empfehlungen.",
    `- Der Kunde soll fühlen: „Diese Agentur kennt meine Branche (${definition.label})."`,
    "- Beziehe mindestens 1–2 branchenspezifische Lösungen in jede Empfehlung ein.",
    "- Bereits besprochene Brancheninfos nicht wiederholen.",
    "- Branche oder Erkennung niemals dem Kunden mitteilen.",
  ];

  if (result.status === "uncertain" && result.alternatives.length > 0) {
    const altLabels = result.alternatives.map((a) => a.label).join(", ");
    lines.push(
      "",
      `Hinweis: Branche unsicher – Alternativen: ${altLabels}.`,
      "Stelle eine natürliche Rückfrage zur Klärung, wenn es die Empfehlung verbessert."
    );
  }

  return lines.join("\n");
}

function buildUnknownPrompt(result: IndustryRecognitionResult): string {
  const question = pickDiscoveryQuestion(result.messageCount);

  return [
    "BRANCHENERKENNUNG (INTERN – NUTZER SIEHT DIES NICHT):",
    "Branche: Noch nicht erkannt.",
    "",
    "Anweisungen:",
    "- Branche möglichst natürlich im Gespräch herausfinden – kein Formular-Stil.",
    `- Beispiel-Richtung (variieren): „${question}"`,
    "- Erst nach Branchenklärung branchenspezifische Lösungen empfehlen.",
    "- Bis dahin: allgemein beraten. Branchenfrage übernimmt dieses Modul – PROAKTIVE BERATUNG stellt dann keine zweite Branchenfrage.",
    "- Branchenerkennung niemals dem Kunden mitteilen.",
  ].join("\n");
}

/**
 * Erzeugt internen Prompt für branchenspezifische Beratung.
 */
export function buildIndustryPrompt(
  result: IndustryRecognitionResult
): string {
  if (result.status === "unknown" || !result.primary) {
    return buildUnknownPrompt(result);
  }

  return buildDetectedPrompt(result);
}

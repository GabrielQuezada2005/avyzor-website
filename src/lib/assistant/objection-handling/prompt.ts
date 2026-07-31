/**
 * Einwandbehandlung – Interner Prompt-Generator
 *
 * Übersetzt erkannte Einwände in KI-Anweisungen (unsichtbar für Nutzer).
 */

import { OBJECTION_BY_ID } from "./catalog";
import type { ObjectionHandlingResult } from "./types";

/**
 * Erzeugt internen Prompt für professionelle Einwandbehandlung.
 */
export function buildObjectionHandlingPrompt(
  result: ObjectionHandlingResult
): string {
  if (!result.primary) {
    return "";
  }

  const definition = OBJECTION_BY_ID[result.primary.type];
  if (!definition) return "";

  const lines: string[] = [
    "EINWANDBEHANDLUNG (INTERN – NUTZER SIEHT DIES NICHT):",
    `Erkannter Einwand: ${definition.label}`,
    `Zusammenfassung: ${definition.summaryTemplate}`,
    "",
    "Reaktions-Ablauf (STRIKT einhalten):",
    "1. Einwand kurz anerkennen – ohne Standardfloskeln wie 'Ich verstehe' oder 'Darf ich fragen'.",
    "2. ZUERST geschäftlichen Nutzen und Wert erklären – besonders bei Preiseinwänden.",
    "3. Mit hilfreicher Erklärung antworten – kein Gegenargument, kein 'Aber …'.",
    "4. Passende Alternativen anbieten – ohne Druck.",
    "5. Sinnvolle nächste Möglichkeit anbieten.",
    "",
    "Empathie-Orientierung (Stil, nicht wörtlich):",
    ...definition.empathyExamples.map((e) => `- '${e}'`),
    "",
    "Erklärungs-Hinweise:",
    ...definition.explanationHints.map((h) => `- ${h}`),
    "",
    "Mögliche Rückfrage (eine wählen):",
    ...definition.followUpQuestions.map((q) => `- '${q}'`),
    "",
    "Sinnvolle nächste Schritte (optional, nicht aufdringlich):",
    ...definition.nextStepOffers.map((s) => `- ${s}`),
    "",
    "Falls Einwand nicht auflösbar:",
    ...definition.unresolvedFallback.map((f) => `- ${f}`),
    "",
    "VERBOTEN:",
    "- Aggressiv verkaufen oder unter Druck setzen.",
    "- 'Aber …', 'Trotzdem …', 'Jetzt zuschlagen'.",
    "- Einwand ignorieren oder abwürgen.",
    "- Mehrere Rückfragen gleichzeitig stellen.",
    "",
    "Der Nutzer darf den erkannten Einwandtyp niemals erfahren.",
  ];

  return lines.join("\n");
}

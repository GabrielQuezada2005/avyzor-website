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
    "Reaktions-Ablauf bei Einwand (STRIKT – 3 Schritte):",
    "1. Verständnis – Einwand kurz anerkennen, individuell auf den Kunden eingehen. Keine Standardfloskeln.",
    "2. Einordnung – Einwand sachlich entkräften mit Nutzen und Fakten, nicht mit Gegenargumenten oder Aber-Sätzen.",
    "3. Lösung – Passende Alternative oder Empfehlung geben + konkrete Anschlussfrage.",
    "",
    "WICHTIG:",
    "- Niemals identische Standardantworten – auf Gesprächskontext und Branche beziehen.",
    "- Nutzen statt Features: geschäftlichen Mehrwert erklären, nicht Feature-Listen.",
    "- Kurze Absätze (max. 2–3 Sätze), prägnant.",
    "- Kein Verkaufsdruck – beraten, nicht überreden.",
    "",
    "Empathie-Orientierung (Stil variieren, nicht wörtlich wiederholen):",
    ...definition.empathyExamples.map((e) => `- '${e}'`),
    "",
    "Erklärungs-Hinweise:",
    ...definition.explanationHints.map((h) => `- ${h}`),
  ];

  if (definition.benefitExamples && definition.benefitExamples.length > 0) {
    lines.push("", "Nutzen- statt Feature-Formulierung (Orientierung):");
    lines.push(...definition.benefitExamples.map((b) => `- ${b}`));
  }

  lines.push(
    "",
    "Mögliche Rückfrage (eine wählen, an Kontext anpassen):",
    ...definition.followUpQuestions.map((q) => `- '${q}'`),
    "",
    "Sinnvolle nächste Schritte (optional, nicht aufdringlich):",
    ...definition.nextStepOffers.map((s) => `- ${s}`),
    "",
    "Termin anbieten:",
    "- Als logischen nächsten Schritt – gemeinsam die beste Lösung entwickeln, nicht als Verkaufsabschluss.",
    "",
    "Falls Einwand nicht auflösbar:",
    ...definition.unresolvedFallback.map((f) => `- ${f}`),
    "",
    "VERBOTEN:",
    "- Aggressiv verkaufen oder unter Druck setzen.",
    "- Jetzt zuschlagen, Nur noch heute, Das müssen Sie – niemals verwenden.",
    "- Einwand ignorieren, abwürgen oder mit Standardtext abhandeln.",
    "- Mehrere Rückfragen gleichzeitig stellen.",
    "- Erfundene Referenzen oder Kundennamen als Social Proof.",
    "",
    "Der Nutzer darf den erkannten Einwandtyp niemals erfahren."
  );

  return lines.join("\n");
}

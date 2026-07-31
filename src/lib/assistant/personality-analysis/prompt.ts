/**
 * Persönlichkeitsanalyse – Interner Prompt-Generator
 *
 * Übersetzt Profile in unauffällige Kommunikationsanpassungen (unsichtbar für Nutzer).
 */

import { mergeAdaptations } from "./profiler";
import type { PersonalityAnalysisResult } from "./types";
import { PERSONALITY_PROFILE_LABELS } from "./types";

/**
 * Erzeugt internen Prompt zur Anpassung von Tonfall, Detailtiefe etc.
 */
export function buildPersonalityPrompt(
  result: PersonalityAnalysisResult
): string {
  if (!result.primary) {
    return "";
  }

  const adaptations = mergeAdaptations(
    result.primary.type,
    result.secondary?.type ?? null
  );

  if (!adaptations) return "";

  const profileLabels = result.profiles
    .map((p) => PERSONALITY_PROFILE_LABELS[p.type])
    .join(", ");

  const lines: string[] = [
    "PERSÖNLICHKEITSANALYSE (INTERN – NUTZER SIEHT DIES NICHT):",
    `Erkannte Kommunikationsprofile: ${profileLabels}`,
    "",
    "Passe deine Antwort UNAUFFÄLLIG und FLIESSEND an – niemals unnatürlich wirken:",
    `- Tonfall: ${adaptations.tone}`,
    `- Wortwahl: ${adaptations.wordChoice}`,
    `- Detailtiefe: ${adaptations.detailDepth}`,
    `- Antwortlänge: ${adaptations.responseLength}`,
    `- Rückfragen: ${adaptations.followUpCount}`,
    `- Beratungsstrategie: ${adaptations.salesStrategy}`,
    `- Erklärungstiefe: ${adaptations.explanationDepth}`,
    `- Gesprächstempo: ${adaptations.conversationPace}`,
    "",
    "Merkmale (intern):",
    `- Schreibstil: ${result.traits.writingStyle}`,
    `- Satzlänge: ${result.traits.avgSentenceLength}`,
    `- Wortwahl-Niveau: ${result.traits.vocabulary}`,
    `- Entscheidungsverhalten: ${result.traits.decisionBehavior}`,
    `- Ton: ${result.traits.tone}`,
    "",
    "WICHTIG:",
    "- Anpassungen subtil umsetzen – der Kunde soll den Unterschied spüren, nicht bemerken.",
    "- Profile oder Analyse niemals erwähnen.",
    "- Bei widersprüchlichen Profilen: primäres Profil hat Vorrang.",
    "- Bei Konflikt mit Anschlussfragen: max. eine Frage; hurried-Profil darf ohne Rückfrage antworten, wenn Empfehlung klar ist.",
    "- MODUL-PRIORITÄT und System-Prompt haben Vorrang vor Tonfall-Anpassungen.",
  ];

  return lines.join("\n");
}

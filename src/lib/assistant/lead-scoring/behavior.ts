/**
 * Lead-Scoring – Verhaltensanpassung
 *
 * Erzeugt interne System-Prompt-Ergänzungen basierend auf Lead-Kategorie.
 * Der Nutzer sieht diese Anweisungen nie – sie steuern nur das KI-Verhalten.
 */

import type { LeadCategory, LeadScoreResult } from "./types";

const BEHAVIOR_BY_CATEGORY: Record<LeadCategory, string> = {
  low: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Niedrig. Fokus auf Vertrauen und Information.
- Mehr hilfreiche Informationen geben, ohne zu verkaufen.
- Vertrauen aufbauen durch Verständnis und Branchenwissen.
- Keine Verkaufsversuche, keine Paketempfehlungen, keine Terminvorschläge.
- Weiter gezielte Rückfragen stellen, um Bedürfnisse zu verstehen.
- Geduldig bleiben, keinen Druck ausüben.`,

  interested: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Mittel. Fokus auf gezielte Beratung.
- Gezielt beraten und konkrete Vorteile für die Situation erklären.
- Rückfragen stellen, um den Bedarf weiter zu klären.
- Geschäftlichen Nutzen betonen, nicht Features auflisten.
- Noch keine aktive Terminbuchung – erst wenn der Kunde Interesse signalisiert.
- Preise nur nennen, wenn der Kunde ausdrücklich danach fragt.`,

  high: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Hoch. Fokus auf konkrete Empfehlungen.
- Konkrete, individuelle Empfehlungen auf Basis des Gesprächs geben.
- Passendes Paket vorschlagen, wenn Kontext und Preisanfrage vorliegen.
- Terminbuchung für ein unverbindliches Erstgespräch anbieten.
- Auf erkannte Bedürfnisse und Ziele eingehen.
- Selbstbewusst beraten, aber nicht aufdringlich.`,

  premium: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Sehr hoch – Premium-Lead. Höchste Priorität.
- Premium-Beratung: persönlich, kompetent, auf Augenhöhe.
- Aktiv und selbstbewusst zum Erstgespräch führen.
- Konkretes Paket empfehlen und Terminbuchung proaktiv anbieten.
- Dringlichkeit des Kunden würdigen und schnelle nächste Schritte aufzeigen.
- Individuelle Lösung betonen – fester Ansprechpartner, maßgeschneidert.`,
};

/**
 * Erzeugt den internen Prompt-Zusatz zur Verhaltensanpassung.
 * Wird dem System-Prompt angehängt – unsichtbar für den Nutzer.
 */
export function buildLeadBehaviorPrompt(result: LeadScoreResult): string {
  const behavior = BEHAVIOR_BY_CATEGORY[result.category];

  return `${behavior}

Lead-Score (intern): ${result.score}/100 – ${result.categoryLabel}
Diese Information ist ausschließlich für dein Beratungsverhalten. Erwähne Score oder Kategorie niemals gegenüber dem Nutzer.`;
}

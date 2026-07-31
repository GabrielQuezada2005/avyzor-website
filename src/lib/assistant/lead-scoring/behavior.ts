/**
 * Lead-Scoring – Verhaltensanpassung
 *
 * Erzeugt interne System-Prompt-Ergänzungen basierend auf Lead-Kategorie.
 * Der Nutzer sieht diese Anweisungen nie – sie steuern nur das KI-Verhalten.
 */

import type { LeadCategory, LeadScoreResult } from "./types";

const BEHAVIOR_BY_CATEGORY: Record<LeadCategory, string> = {
  low: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Niedrig. Fokus auf Vertrauen und kompetente Orientierung.
- Branchenwissen zeigen und erste Lösungsrichtung empfehlen – ab 2. Nachricht.
- Keine Preise nennen, keine Terminvorschläge erzwingen.
- Selbstbewusst beraten, nicht nur Fragen stellen.`,

  interested: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Mittel. Fokus auf konkrete Empfehlungen.
- Ab 2. bis 3. Nachricht: konkrete Lösung mit Begründung empfehlen.
- Geschäftlichen Nutzen betonen, nicht Features auflisten.
- Termin anbieten, wenn Interesse erkennbar – als logischer nächster Schritt.
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

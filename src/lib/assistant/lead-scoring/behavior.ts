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
- Kurz beraten (80–180 Wörter, kurze Absätze), ab 2. Nachricht empfehlen.
- Nach Empfehlung: eine konkrete Anschlussfrage.
- Keine Preise nennen, keine Terminvorschläge erzwingen.`,

  interested: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Mittel. Fokus auf konkrete Empfehlungen.
- Ab 2. bis 3. Nachricht: Empfehlung + Nutzen + Anschlussfrage.
- Kurze Absätze, prägnant – kein ChatGPT-Artikel.
- Termin anbieten, wenn Interesse erkennbar.
- Preise nur nennen, wenn der Kunde ausdrücklich danach fragt.`,

  high: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Hoch. Fokus auf konkrete Empfehlungen.
- Konkrete Empfehlung mit Begründung, dann Anschlussfrage oder Termin.
- Kurz und selbstbewusst – bereits Genanntes nicht wiederholen.
- Passendes Paket vorschlagen, wenn Kontext und Preisanfrage vorliegen.`,

  premium: `LEAD-PROFIL (INTERN – NUTZER SIEHT DIES NICHT):
Kaufbereitschaft: Sehr hoch – Premium-Lead. Höchste Priorität.
- Premium-Beratung: persönlich, kompetent, prägnant.
- Empfehlung + Nutzen + Termin oder Anschlussfrage.
- Dringlichkeit würdigen, schnelle nächste Schritte aufzeigen.`,
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

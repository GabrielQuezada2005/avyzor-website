/**
 * Prompt-Orchestrator
 *
 * Definiert die Priorität und Reihenfolge aller internen Verhaltensmodule.
 * Keine Analyse-Logik – nur Zusammenführung der Prompt-Fragmente.
 */

export interface BehaviorPromptFragments {
  leadBehavior?: string;
  industry?: string;
  briefing?: string;
  proactive?: string;
  salesStrategy?: string;
  recommendation?: string;
  objection?: string;
  personality?: string;
}

const PRIORITY_HEADER = `MODUL-PRIORITÄT (INTERN – bei Widersprüchen gilt diese Reihenfolge):
1. Einwandbehandlung – wenn ein Einwand erkannt wurde, hat sie Vorrang.
2. Angebotsempfehlung – genau ein Angebot, ehrlich und begründet.
3. Proaktive Beratung – max. eine gezielte Frage pro Antwort.
4. Projektbriefing – bekannte Fakten nutzen, nicht wiederholen.
5. Branchenerkennung – branchenspezifisch beraten.
6. Verkaufsstrategie & Lead-Profil – Tonfall und Gesprächsphase.
7. Persönlichkeitsanalyse – subtile Anpassung, überschreibt nie Regeln 1–4.

Globale Regeln (System-Prompt) gelten immer. Module ergänzen, widersprechen nicht.`;

/**
 * Fügt interne Module in optimaler Reihenfolge zusammen.
 */
export function composeBehaviorPrompt(
  fragments: BehaviorPromptFragments
): string {
  return [
    PRIORITY_HEADER,
    fragments.leadBehavior,
    fragments.industry,
    fragments.briefing,
    fragments.proactive,
    fragments.salesStrategy,
    fragments.recommendation,
    fragments.objection,
    fragments.personality,
  ]
    .filter(Boolean)
    .join("\n\n");
}

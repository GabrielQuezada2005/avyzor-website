/**
 * Proaktive Beratung – Risiko-Erkennung
 */

import type { DetectedRisk } from "./types";
import type { ProjectBriefing } from "../project-briefing/types";
import type { ScoringMessage } from "../lead-scoring/types";

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

/**
 * Erkennt Beratungs-Risiken und schlägt Alternativen vor.
 */
export function detectRisks(
  messages: ScoringMessage[],
  briefing: ProjectBriefing,
  industryLabel?: string | null
): DetectedRisk[] {
  const text = joinUserText(messages).toLowerCase();
  const risks: DetectedRisk[] = [];

  const hasIndustry =
    Boolean(briefing.client.industry) || Boolean(industryLabel);
  const hasGoals = briefing.project.mainGoals.length > 0;
  const wantsShop =
    /shop|e-commerce|online.?shop|verkauf.*online/i.test(text) ||
    briefing.requirements.desiredFeatures.some((f) =>
      /shop|e-commerce/i.test(f)
    );
  const wantsSeo =
    /seo|suchmaschine|google ranking/i.test(text) ||
    briefing.requirements.desiredFeatures.some((f) => /seo/i.test(f));
  const hasLocation =
    Boolean(briefing.client.location) ||
    /regional|lokal|standort|in \w+/i.test(text);

  if (briefing.messageCount >= 3 && !hasGoals) {
    risks.push({
      id: "missing_goals",
      label: "Ziel unklar",
      explanation:
        "Ohne klares Geschäftsziel ist eine passende Empfehlung schwer – Anfragen vs. Verkäufe machen einen großen Unterschied.",
      alternative:
        "Zuerst klären, ob mehr Anfragen, Verkäufe oder Zeitersparnis im Fokus steht.",
    });
  }

  if (briefing.messageCount >= 2 && !hasIndustry) {
    risks.push({
      id: "missing_industry",
      label: "Branche unklar",
      explanation:
        "Branchenspezifische Lösungen sind deutlich wirkungsvoller als allgemeine Website-Empfehlungen.",
      alternative:
        "Branche natürlich erfragen, dann gezielt empfehlen.",
    });
  }

  if (wantsSeo && !hasLocation && briefing.messageCount >= 2) {
    risks.push({
      id: "strategy_mismatch",
      label: "SEO ohne Standortkontext",
      explanation:
        "Lokale SEO braucht einen Standort oder regionale Ausrichtung – sonst ist die Strategie unpräzise.",
      alternative:
        "Standort oder Einzugsgebiet klären, bevor SEO-Empfehlungen konkret werden.",
    });
  }

  if (
    wantsShop &&
    !/produkt|artikel|ware|sortiment|katalog/i.test(text) &&
    briefing.messageCount >= 2
  ) {
    risks.push({
      id: "premature_scope",
      label: "Shop ohne Produktkontext",
      explanation:
        "Ein Online-Shop lohnt sich vor allem mit klarem Produktangebot – sonst reicht oft eine Anfrage-Lösung.",
      alternative:
        "Erst Produktumfang klären – ggf. mit Landingpage und Anfrageformular starten.",
    });
  }

  if (
    briefing.messageCount >= 4 &&
    !briefing.commercial.budget &&
    briefing.project.mainGoals.length > 0 &&
    /teuer|budget|kosten|preis/i.test(text)
  ) {
    risks.push({
      id: "budget_unclear",
      label: "Budget unklar bei Preisdiskussion",
      explanation:
        "Ohne Budgetrahmen sind Empfehlungen schwer einzuordnen – Risiko für Fehlpassung.",
      alternative:
        "Realistischen Rahmen erfragen oder schrittweise Einstiegsoptionen vorschlagen.",
    });
  }

  return risks.slice(0, 2);
}

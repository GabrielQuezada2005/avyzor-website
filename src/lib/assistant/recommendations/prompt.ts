/**
 * Empfehlungssystem – Interner Prompt-Generator
 *
 * Übersetzt Empfehlungen in KI-Anweisungen (unsichtbar für Nutzer).
 */

import type { RecommendationResult } from "./types";
import type { ProjectBriefing } from "../project-briefing/types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatBriefingContext(briefing?: ProjectBriefing): string[] {
  if (!briefing) return [];
  const lines: string[] = ["Gesprächskontext (intern):"];
  const add = (label: string, value: string | null | string[]) => {
    if (Array.isArray(value) && value.length > 0) {
      lines.push(`- ${label}: ${value.join(", ")}`);
    } else if (value) {
      lines.push(`- ${label}: ${value}`);
    }
  };
  add("Branche", briefing.client.industry);
  add("Unternehmensgröße", briefing.client.companySize);
  add("Ziele", briefing.project.mainGoals);
  add("Probleme", briefing.project.currentProblems);
  add("Budget", briefing.commercial.budget);
  add("Zeitrahmen", briefing.commercial.timeline);
  add("Website-Status", briefing.context.existingWebsite);
  add("Funktionen", briefing.requirements.desiredFeatures);
  add("Marketing", briefing.context.marketingChannels);
  return lines.length > 1 ? lines : [];
}

/**
 * Erzeugt internen Prompt mit Empfehlungslogik für die KI.
 */
export function buildRecommendationPrompt(
  result: RecommendationResult,
  briefing?: ProjectBriefing
): string {
  if (!result.shouldRecommend) {
    return `ANGEBOTSEMPFEHLUNG (INTERN – NUTZER SIEHT DIES NICHT):
Noch nicht genug Kontext für eine konkrete Angebotsempfehlung.
- Kurz beraten (80–180 Wörter, kurze Absätze).
- Eine gezielte Anschlussfrage stellen, um Kontext zu gewinnen.
- Keine Pakete oder Preise nennen, es sei denn der Kunde fragt explizit danach.`;
  }

  const lines: string[] = [
    "ANGEBOTSEMPFEHLUNG (INTERN – NUTZER SIEHT DIES NICHT):",
    "Interne Analyse: Welches EINE Angebot bringt diesem Kunden den größten Mehrwert?",
    "",
  ];

  const briefingLines = formatBriefingContext(briefing);
  if (briefingLines.length > 0) {
    lines.push(...briefingLines, "");
  }

  const { primary, runnerUp, offerAnalysis, addOns, needs } = result;

  if (primary.type === "individual") {
    lines.push(
      "Empfehlung: Individuelle Lösung (kein Standardpaket passt optimal).",
      `Gründe: ${primary.reasons.join("; ")}`,
      "",
      "Anweisung:",
      "- Genau EINE Empfehlung: individuelle Lösung – begründet und transparent.",
      "- Erkläre, warum kein Standardpaket optimal passt.",
      "- Probleme, die gelöst werden, und realistische Ergebnisse nennen.",
      "- Kein Verkaufsdruck – ehrliche Expertenberatung.",
      "- Erstgespräch als nächsten Schritt anbieten."
    );
  } else {
    lines.push(
      `Empfohlenes Angebot (GENAU EINES): ${primary.packageName}${primary.price ? ` (ab ${formatPrice(primary.price)} netto)` : ""}`,
      `Fit-Score (intern): ${primary.fitScore}`,
      `Gründe: ${primary.reasons.join("; ")}`,
      ""
    );

    if (offerAnalysis) {
      lines.push(
        "Transparente Begründung (in Antwort einbauen):",
        `- Warum gewählt: ${offerAnalysis.whyChosen}`,
        `- Probleme, die gelöst werden: ${offerAnalysis.problemsSolved.join("; ")}`,
        `- Enthaltene Leistungen: ${offerAnalysis.includedFeatures.join("; ")}`,
        `- Realistische Ergebnisse: ${offerAnalysis.expectedResults.join("; ")}`
      );

      if (offerAnalysis.comparisonNote) {
        lines.push(`- Kurzer Vergleich: ${offerAnalysis.comparisonNote}`);
      }
      if (offerAnalysis.budgetAlternative) {
        lines.push(`- Budget-Alternative: ${offerAnalysis.budgetAlternative}`);
      }
      if (offerAnalysis.phasedApproach) {
        lines.push(`- Phasenweise Umsetzung: ${offerAnalysis.phasedApproach}`);
      }
    }

    if (runnerUp && runnerUp.packageId !== primary.packageId) {
      lines.push(
        "",
        `Alternative (intern): ${runnerUp.packageName} – nur kurz vergleichen, wenn sinnvoll.`
      );
    }

    lines.push(
      "",
      "Anweisung (STRIKT):",
      `- Empfehle GENAU EIN Angebot: ${primary.packageName}.`,
      `- Formulierung variieren: „Auf Grundlage Ihrer Ziele empfehle ich …, weil …"`,
      "- Transparent erklären: Warum dieses Paket, welche Probleme gelöst werden, was enthalten ist, welche Ergebnisse realistisch sind.",
      "- Kurze Absätze (max. 2–3 Sätze), professionell, ohne Verkaufsdruck.",
      "- Niemals teurer empfehlen als nötig – ehrlich im Interesse des Kunden.",
      "- Preise nur nennen, wenn der Kunde danach fragt oder die Empfehlung konkret wird.",
      "- Nach der Empfehlung: eine konkrete Anschlussfrage oder Erstgespräch anbieten."
    );
  }

  if (needs.goals.length > 0) {
    lines.push("", `Erkannte Ziele: ${needs.goals.join(", ")}`);
  }

  if (needs.features.length > 0) {
    lines.push(`Erkannte Funktionen: ${needs.features.join(", ")}`);
  }

  if (addOns.length > 0) {
    lines.push(
      "",
      "Zusatzleistungen (NUR wenn natürlich passend, max. 1, nicht aufdringlich):"
    );
    for (const addon of addOns.slice(0, 1)) {
      lines.push(`- ${addon.name}: ${addon.reasons[0]}`);
    }
  }

  lines.push(
    "",
    `Lead-Kategorie (intern): ${result.leadCategory}`,
    "Score, Fit-Score und interne Analyse niemals dem Kunden mitteilen."
  );

  return lines.join("\n");
}

/**
 * Ob genug Kontext für eine Empfehlung vorliegt.
 */
export function shouldGenerateRecommendation(
  messageCount: number,
  leadScore: number,
  briefingConfidence?: number
): boolean {
  if (messageCount < 2) return false;
  if (leadScore >= 25) return true;
  if (messageCount >= 3 && (leadScore >= 20 || (briefingConfidence ?? 0) >= 45)) {
    return true;
  }
  if (leadScore >= 20) return true;
  return false;
}

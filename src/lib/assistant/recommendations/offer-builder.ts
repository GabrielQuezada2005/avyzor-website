/**
 * Empfehlungssystem – Angebotsanalyse
 *
 * Erstellt detaillierte, ehrliche Angebotsempfehlungen für die KI.
 */

import { NEUKUNDEN_PLAN, PRICING_PLANS } from "@/lib/constants";
import type {
  CustomerNeeds,
  OfferAnalysis,
  PackageRecommendation,
} from "./types";
import type { LeadScoreResult } from "../lead-scoring/types";
import type { ProjectBriefing } from "../project-briefing/types";

const PACKAGE_FEATURES: Record<string, string[]> = {
  neukunde: NEUKUNDEN_PLAN.features as unknown as string[],
  starter: PRICING_PLANS[0].features as unknown as string[],
  professional: PRICING_PLANS[1].features as unknown as string[],
  enterprise: PRICING_PLANS[2].features as unknown as string[],
};

const FEATURE_LABELS: Record<string, string> = {
  website: "Professionelle Website",
  terminbuchung: "Online-Terminbuchung",
  chatbot: "KI-Chatbot",
  seo: "SEO-Optimierung",
  crm: "CRM-Integration",
  automatisierung: "Prozess-Automatisierung",
  "google-ads": "Google Ads",
  whatsapp: "WhatsApp-Integration",
  hosting: "Hosting & SSL",
  wartung: "Wartung & Support",
  performance: "Performance-Optimierung",
  ecommerce: "E-Commerce / Online-Shop",
};

function getPackageFeatures(rec: PackageRecommendation): string[] {
  if (rec.type === "individual") {
    return ["Individuell abgestimmter Umfang"];
  }
  if (rec.packageId && PACKAGE_FEATURES[rec.packageId]) {
    return PACKAGE_FEATURES[rec.packageId];
  }
  return rec.reasons;
}

function buildProblemsSolved(
  needs: CustomerNeeds,
  briefing?: ProjectBriefing
): string[] {
  const problems: string[] = [];

  for (const goal of needs.goals) {
    if (goal.includes("Kunden")) problems.push("Zu wenig qualifizierte Anfragen");
    if (goal.includes("Sichtbarkeit")) problems.push("Schlechte Online-Sichtbarkeit");
    if (goal.includes("Zeit")) problems.push("Zu viel manueller Aufwand");
    if (goal.includes("Termin")) problems.push("Telefonischer Terminaufwand");
    if (goal.includes("Umsatz")) problems.push("Verlorene Verkaufschancen online");
    if (goal.includes("Image")) problems.push("Unprofessioneller Ersteindruck");
  }

  for (const p of briefing?.project.currentProblems ?? []) {
    if (!problems.includes(p)) problems.push(p);
  }

  if (problems.length === 0) {
    problems.push("Fehlende oder unzureichende Online-Präsenz");
  }

  return problems.slice(0, 4);
}

function buildExpectedResults(
  rec: PackageRecommendation,
  needs: CustomerNeeds
): string[] {
  const results: string[] = [];

  if (needs.features.includes("terminbuchung") || needs.goals.some((g) => g.includes("Termin"))) {
    results.push("Weniger Telefonanfragen, Buchungen auch außerhalb der Öffnungszeiten");
  }
  if (needs.features.includes("seo") || needs.goals.some((g) => g.includes("Sichtbarkeit"))) {
    results.push("Bessere Auffindbarkeit in Google und mehr organische Anfragen");
  }
  if (needs.goals.some((g) => g.includes("Kunden"))) {
    results.push("Mehr qualifizierte Anfragen über die Website");
  }
  if (rec.packageId === "neukunde") {
    results.push("Professioneller Online-Auftritt in ca. 2 Wochen");
  }
  if (rec.packageId === "professional" || rec.packageId === "enterprise") {
    results.push("Skalierbare digitale Basis für weiteres Wachstum");
  }

  if (results.length === 0) {
    results.push("Professioneller Auftritt und klarere Kundenkommunikation online");
  }

  return results.slice(0, 3);
}

function isTightBudget(
  signals: LeadScoreResult["signals"],
  briefing?: ProjectBriefing
): boolean {
  if (signals.budget === "low_budget") return true;
  const budgetText = briefing?.commercial.budget?.toLowerCase() ?? "";
  return /eng|knapp|unter|maximal|höchstens/i.test(budgetText);
}

function buildComparisonNote(
  primary: PackageRecommendation,
  runnerUp: PackageRecommendation | null
): string | null {
  if (!runnerUp || runnerUp.packageId === primary.packageId) return null;
  if (primary.fitScore - runnerUp.fitScore > 15) return null;

  return `${runnerUp.packageName} wäre ebenfalls denkbar, aber ${primary.packageName} passt besser, weil: ${primary.reasons[0] ?? "höhere Passgenauigkeit zu Ihren Zielen"}.`;
}

function buildBudgetAlternativeNote(
  primary: PackageRecommendation,
  budgetAlt: PackageRecommendation | null,
  tightBudget: boolean
): { budgetAlternative: string | null; phasedApproach: string | null } {
  if (!budgetAlt || budgetAlt.packageId === primary.packageId) {
    return { budgetAlternative: null, phasedApproach: null };
  }

  if (!tightBudget && (primary.price ?? 0) <= (budgetAlt.price ?? 0) * 1.5) {
    return { budgetAlternative: null, phasedApproach: null };
  }

  const budgetAlternative = `Bei einem engeren Budget: ${budgetAlt.packageName} ab ${budgetAlt.price?.toLocaleString("de-DE")} Euro netto als solide Alternative.`;

  const phasedApproach =
    primary.price && budgetAlt.price && primary.price > budgetAlt.price
      ? `Phasenweise Umsetzung möglich: Zuerst ${budgetAlt.packageName}, später gezielt erweitern – z. B. Terminbuchung, SEO oder Automatisierung.`
      : null;

  return { budgetAlternative, phasedApproach };
}

/**
 * Erstellt die detaillierte Angebotsanalyse.
 */
export function buildOfferAnalysis(
  primary: PackageRecommendation,
  runnerUp: PackageRecommendation | null,
  budgetAlt: PackageRecommendation | null,
  needs: CustomerNeeds,
  leadScoreResult: LeadScoreResult,
  briefing?: ProjectBriefing
): OfferAnalysis {
  const tightBudget = isTightBudget(leadScoreResult.signals, briefing);
  const { budgetAlternative, phasedApproach } = buildBudgetAlternativeNote(
    primary,
    budgetAlt,
    tightBudget
  );

  const whyParts: string[] = [];
  if (needs.goals.length > 0) {
    whyParts.push(`Ihr Ziel „${needs.goals[0]}"`);
  }
  if (needs.industry) {
    whyParts.push(`Ihre Branche`);
  }
  if (needs.features.length > 0) {
    whyParts.push(
      `gewünschte Funktionen (${needs.features.map((f) => FEATURE_LABELS[f] ?? f).join(", ")})`
    );
  }
  if (briefing?.client.companySize) {
    whyParts.push(`Ihre Unternehmensgröße`);
  }

  const whyChosen =
    whyParts.length > 0
      ? `Auf Grundlage von ${whyParts.join(", ")} empfehle ich ${primary.packageName}.`
      : `Auf Grundlage Ihres Gesprächs empfehle ich ${primary.packageName}.`;

  return {
    whyChosen,
    problemsSolved: buildProblemsSolved(needs, briefing),
    includedFeatures: getPackageFeatures(primary),
    expectedResults: buildExpectedResults(primary, needs),
    comparisonNote: buildComparisonNote(primary, runnerUp),
    budgetAlternative,
    phasedApproach,
    honestyNote:
      "Niemals teurer empfehlen als nötig – immer die ehrlich beste Lösung für den Kunden, nicht den höchsten Umsatz.",
  };
}

export { FEATURE_LABELS };

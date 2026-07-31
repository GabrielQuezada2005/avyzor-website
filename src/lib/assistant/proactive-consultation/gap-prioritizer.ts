/**
 * Proaktive Beratung – Lücken-Priorisierung
 */

import { BRIEFING_FIELD_CATALOG } from "../project-briefing/fields/catalog";
import type { ProjectBriefing } from "../project-briefing/types";
import type { PrioritizedGap } from "./types";

/** Welche Felder für welche Beratungsstufe kritisch sind. */
const FIELD_TIERS: Record<string, 1 | 2 | 3> = {
  mainGoals: 1,
  industry: 1,
  existingWebsite: 1,
  businessFocus: 1,
  targetAudience: 2,
  desiredFeatures: 2,
  budget: 2,
  timeline: 2,
  hasAppointmentBooking: 2,
  marketingChannels: 2,
  hasLogo: 3,
  hasCorporateDesign: 3,
  hasDomain: 3,
  hasContent: 3,
  hasCrm: 3,
  location: 3,
  designWishes: 3,
};

const NATURAL_QUESTIONS: Record<string, string> = {
  mainGoals:
    "Was möchten Sie mit der Website vor allem erreichen – mehr Anfragen oder eher Verkäufe?",
  industry: "In welcher Branche sind Sie tätig?",
  existingWebsite: "Haben Sie bereits eine Website, oder starten Sie bei null?",
  businessFocus:
    "Steht bei Ihnen eher die Kundengewinnung oder der direkte Verkauf im Vordergrund?",
  targetAudience: "An welche Zielgruppe richten Sie sich hauptsächlich?",
  desiredFeatures:
    "Gibt es Funktionen, die Ihnen besonders wichtig sind – z. B. Terminbuchung oder Kontaktformular?",
  budget:
    "Haben Sie einen ungefähren Budgetrahmen im Kopf?",
  timeline: "Gibt es einen Zeitraum, bis wann die Website stehen soll?",
  hasAppointmentBooking:
    "Nutzen Sie bereits eine Online-Terminbuchung?",
  marketingChannels:
    "Setzen Sie bereits auf SEO, Google Ads oder Social Media?",
  hasLogo: "Haben Sie bereits ein Logo oder Corporate Design?",
  hasCorporateDesign:
    "Gibt es bereits ein Corporate Design mit Farben und Schrift?",
  hasDomain: "Haben Sie bereits eine Domain?",
  hasContent:
    "Liegen bereits Texte und Bilder vor, oder brauchen Sie Unterstützung dabei?",
  hasCrm: "Nutzen Sie bereits ein CRM für Ihre Kundenkontakte?",
  location: "In welcher Region sind Sie hauptsächlich tätig?",
  designWishes: "Haben Sie konkrete Vorstellungen zum Design?",
};

function isFieldFilled(briefing: ProjectBriefing, fieldId: string): boolean {
  const b = briefing;
  switch (fieldId) {
    case "companyName":
      return Boolean(b.client.companyName);
    case "contactPerson":
      return Boolean(b.client.contactPerson);
    case "industry":
      return Boolean(b.client.industry);
    case "companySize":
      return Boolean(b.client.companySize);
    case "location":
      return Boolean(b.client.location);
    case "targetAudience":
      return Boolean(b.project.targetAudience);
    case "mainGoals":
      return b.project.mainGoals.length > 0;
    case "currentProblems":
      return b.project.currentProblems.length > 0;
    case "businessFocus":
      return Boolean(b.project.businessFocus);
    case "budget":
      return Boolean(b.commercial.budget);
    case "timeline":
      return Boolean(b.commercial.timeline);
    case "desiredFeatures":
      return b.requirements.desiredFeatures.length > 0;
    case "designWishes":
      return Boolean(b.requirements.designWishes);
    case "colorPreferences":
      return Boolean(b.requirements.colorPreferences);
    case "hasLogo":
      return Boolean(b.requirements.hasLogo);
    case "hasCorporateDesign":
      return Boolean(b.requirements.hasCorporateDesign);
    case "hasDomain":
      return Boolean(b.requirements.hasDomain);
    case "hasContent":
      return Boolean(b.requirements.hasContent);
    case "hasCrm":
      return Boolean(b.requirements.hasCrm);
    case "hasAppointmentBooking":
      return Boolean(b.requirements.hasAppointmentBooking);
    case "integrations":
      return b.requirements.integrations.length > 0;
    case "specialRequirements":
      return b.requirements.specialRequirements.length > 0;
    case "competition":
      return Boolean(b.context.competition);
    case "marketingChannels":
      return b.context.marketingChannels.length > 0;
    case "existingWebsite":
      return Boolean(b.context.existingWebsite);
    default:
      return false;
  }
}

/**
 * Priorisiert fehlende Informationen für proaktive Beratung.
 */
export function prioritizeGaps(
  briefing: ProjectBriefing,
  industryLabel?: string | null
): PrioritizedGap[] {
  const gaps: PrioritizedGap[] = [];

  for (const field of BRIEFING_FIELD_CATALOG) {
    const tier = FIELD_TIERS[field.id];
    if (!tier) continue;
    if (field.id === "industry" && industryLabel) continue;
    if (isFieldFilled(briefing, field.id)) continue;

    gaps.push({
      fieldId: field.id,
      label: field.label,
      tier,
      askPriority: field.askPriority,
      naturalQuestion:
        NATURAL_QUESTIONS[field.id] ??
        `Können Sie mir etwas zu „${field.label}" sagen?`,
    });
  }

  return gaps.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.askPriority - a.askPriority;
  });
}

/**
 * Wählt maximal eine Frage für den nächsten Beratungsschritt.
 */
export function selectNextQuestion(
  gaps: PrioritizedGap[],
  messageCount: number
): PrioritizedGap | null {
  if (messageCount < 2 || gaps.length === 0) return null;

  // Früh: nur Tier-1, ab 3 Nachrichten auch Tier-2, ab 5 auch Tier-3
  const maxTier: 1 | 2 | 3 =
    messageCount >= 5 ? 3 : messageCount >= 3 ? 2 : 1;

  return gaps.find((g) => g.tier <= maxTier) ?? null;
}

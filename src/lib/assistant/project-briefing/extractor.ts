/**
 * Projektbriefing – Daten-Extraktion
 *
 * Sammelt alle Felder aus dem Gesprächsverlauf.
 */

import { BRIEFING_FIELD_CATALOG } from "./fields/catalog";
import type { BriefingFieldValue } from "./types";
import type { ScoringMessage } from "../lead-scoring/types";

function joinUserText(messages: ScoringMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

/**
 * Extrahiert alle Briefing-Felder aus dem Gespräch.
 */
export function extractBriefingFields(
  messages: ScoringMessage[]
): BriefingFieldValue[] {
  const text = joinUserText(messages);

  return BRIEFING_FIELD_CATALOG.map((field) => {
    const value = field.extract(text, messages);
    return {
      id: field.id,
      label: field.label,
      value,
      category: field.category,
      filled: value !== null && value.trim().length > 0,
    };
  });
}

/**
 * Mappt extrahierte Felder auf die Briefing-Struktur.
 */
export function mapFieldsToBriefing(
  fields: BriefingFieldValue[]
): Omit<
  import("./types").ProjectBriefing,
  "sessionId" | "confidenceScore" | "missingFields" | "messageCount" | "updatedAt"
> {
  const get = (id: string): string | null =>
    fields.find((f) => f.id === id)?.value ?? null;

  const getList = (id: string): string[] => {
    const val = get(id);
    if (!val) return [];
    return val.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  };

  return {
    client: {
      companyName: get("companyName"),
      contactPerson: get("contactPerson"),
      industry: get("industry"),
      companySize: get("companySize"),
      location: get("location"),
    },
    project: {
      mainGoals: getList("mainGoals"),
      currentProblems: getList("currentProblems"),
      targetAudience: get("targetAudience"),
      businessFocus: get("businessFocus"),
    },
    requirements: {
      desiredFeatures: getList("desiredFeatures"),
      designWishes: get("designWishes"),
      integrations: getList("integrations"),
      specialRequirements: getList("specialRequirements"),
      colorPreferences: get("colorPreferences"),
      hasLogo: get("hasLogo"),
      hasDomain: get("hasDomain"),
      hasCorporateDesign: get("hasCorporateDesign"),
      hasContent: get("hasContent"),
      hasCrm: get("hasCrm"),
      hasAppointmentBooking: get("hasAppointmentBooking"),
    },
    commercial: {
      budget: get("budget"),
      timeline: get("timeline"),
    },
    context: {
      competition: get("competition"),
      marketingChannels: getList("marketingChannels"),
      existingWebsite: get("existingWebsite"),
    },
  };
}

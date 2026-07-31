/**
 * Projektbriefing – Dokument-Generator
 *
 * Erstellt modulares Briefing für CRM, PDF, Dashboard und Projektakten.
 */

import type {
  BriefingDocument,
  BriefingExportSection,
  ProjectBriefing,
} from "./types";

function section(
  id: string,
  title: string,
  entries: Array<[string, string | null | string[]]>
): BriefingExportSection {
  const fields = entries
    .filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== "";
    })
    .map(([label, value]) => ({
      label,
      value: Array.isArray(value) ? value.join(", ") : (value as string),
    }));

  return { id, title, fields };
}

/**
 * Erzeugt ein exportierbares Briefing-Dokument.
 */
export function buildBriefingDocument(
  briefing: ProjectBriefing
): BriefingDocument {
  const { client, project, requirements, commercial, context } = briefing;

  const sections: BriefingExportSection[] = [
    section("client", "Kunde & Unternehmen", [
      ["Firmenname", client.companyName],
      ["Ansprechpartner", client.contactPerson],
      ["Branche", client.industry],
      ["Unternehmensgröße", client.companySize],
      ["Standort", client.location],
    ]),
    section("project", "Projektziele", [
      ["Hauptziele", project.mainGoals],
      ["Aktuelle Probleme", project.currentProblems],
      ["Zielgruppe", project.targetAudience],
    ]),
    section("commercial", "Budget & Zeitrahmen", [
      ["Budget", commercial.budget],
      ["Zeitrahmen", commercial.timeline],
    ]),
    section("requirements", "Anforderungen & Funktionen", [
      ["Gewünschte Funktionen", requirements.desiredFeatures],
      ["Designwünsche", requirements.designWishes],
      ["Wunschfarben", requirements.colorPreferences],
      ["Firmenlogo", requirements.hasLogo],
      ["Domain vorhanden", requirements.hasDomain],
      ["Integrationen", requirements.integrations],
      ["Besondere Anforderungen", requirements.specialRequirements],
    ]),
    section("context", "Kontext & Bestand", [
      ["Bestehende Website", context.existingWebsite],
      ["Konkurrenz", context.competition],
      ["Marketingkanäle", context.marketingChannels],
    ]),
  ].filter((s) => s.fields.length > 0);

  const companyLabel = client.companyName ?? "Neues Projekt";

  return {
    sessionId: briefing.sessionId,
    title: `Projektbriefing – ${companyLabel}`,
    confidenceScore: briefing.confidenceScore,
    missingFields: briefing.missingFields,
    sections,
    generatedAt: briefing.updatedAt,
  };
}

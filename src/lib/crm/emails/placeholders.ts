/**
 * CRM-E-Mail – Platzhalter-Auflösung
 */

import type { CrmLead } from "../types";
import { formatEuro } from "../quotes/match-service";
import type { CrmQuote } from "../quotes/types";
import type { CrmEmailPlaceholderValues } from "./types";

const PLACEHOLDER_PATTERN = /\{\{(\w+)\}\}/g;

export function buildPlaceholderValues(
  lead: CrmLead,
  quote?: CrmQuote | null
): CrmEmailPlaceholderValues {
  return {
    Name: lead.name?.trim() || "Kunde",
    Firma: lead.company?.trim() || "Ihr Unternehmen",
    Dienstleistung:
      lead.service?.trim() ||
      lead.detectedServices[0]?.trim() ||
      "Ihre Anfrage",
    Angebotsnummer: quote?.quoteNumber ?? "",
    Preis: quote ? formatEuro(quote.draft.priceAmount) : "",
  };
}

export function applyPlaceholders(
  template: string,
  values: CrmEmailPlaceholderValues
): string {
  return template.replace(PLACEHOLDER_PATTERN, (_match, key: string) => {
    const typedKey = key as keyof CrmEmailPlaceholderValues;
    return values[typedKey] ?? "";
  });
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

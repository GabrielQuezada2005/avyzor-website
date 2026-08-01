/**
 * CRM-Angebote – Prüfung der Auto-Generierungs-Voraussetzungen
 */

import { MIN_QUOTE_COMPLETENESS_SCORE } from "./constants";
import type { CrmLead } from "../types";

function hasContact(lead: CrmLead): boolean {
  return Boolean(lead.email?.trim() || lead.phone?.trim());
}

function hasIdentity(lead: CrmLead): boolean {
  return Boolean(lead.name?.trim() || lead.company?.trim());
}

function hasServiceIntent(lead: CrmLead): boolean {
  return Boolean(
    lead.service?.trim() ||
      lead.detectedServices.some((service) => service.trim().length > 0)
  );
}

/** Prüft, ob ein Lead genügend Informationen für einen Angebotsentwurf hat. */
export function shouldAutoGenerateQuote(lead: CrmLead): boolean {
  return (
    lead.completenessScore >= MIN_QUOTE_COMPLETENESS_SCORE &&
    hasContact(lead) &&
    hasIdentity(lead) &&
    hasServiceIntent(lead)
  );
}

import "server-only";

import type { CrmLead } from "../types";
import {
  buildQuoteDraft,
  createQuoteNumber,
} from "./build-quote-draft";
import { upsertCrmQuote } from "./repository.server";
import { shouldAutoGenerateQuote } from "./should-generate-quote";
import type { CrmQuoteGenerateResult } from "./types";

/**
 * Erstellt oder aktualisiert automatisch einen Angebotsentwurf für einen Lead.
 * Fehler werden geloggt, blockieren aber nicht den Lead-Sync.
 */
export async function autoGenerateQuoteForLead(
  lead: CrmLead
): Promise<CrmQuoteGenerateResult> {
  if (!shouldAutoGenerateQuote(lead)) {
    return { generated: false, quote: null, reason: "not_eligible" };
  }

  try {
    const draft = buildQuoteDraft(lead);
    const quoteNumber = createQuoteNumber(lead.id);
    const quote = await upsertCrmQuote(lead.id, quoteNumber, draft);

    console.info(
      `[crm-quote] Angebot erstellt lead=${lead.id} quote=${quote.quoteNumber} price=${draft.priceAmount}`
    );

    return { generated: true, quote };
  } catch (error) {
    console.error("[crm-quote] Auto-Generierung fehlgeschlagen:", error);
    return { generated: false, quote: null, reason: "error" };
  }
}

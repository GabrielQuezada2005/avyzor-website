/**
 * CRM-Angebote – Öffentliche API
 */

export {
  CRM_QUOTES_TABLE,
  MIN_QUOTE_COMPLETENESS_SCORE,
  QUOTE_VALIDITY_DAYS,
} from "./constants";

export type {
  CrmQuote,
  CrmQuoteDraft,
  CrmQuoteGenerateResult,
  CrmQuoteLineItem,
  CrmQuoteStatus,
} from "./types";

export { buildQuoteDraft, createQuoteNumber } from "./build-quote-draft";
export { shouldAutoGenerateQuote } from "./should-generate-quote";
export { formatEuro, matchServicePackage } from "./match-service";

export { autoGenerateQuoteForLead } from "./auto-generate.server";
export { generateQuotePdf } from "./generate-quote-pdf.server";
export { getCrmQuoteByLeadId, upsertCrmQuote } from "./repository.server";

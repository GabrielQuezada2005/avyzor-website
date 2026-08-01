/**
 * CRM – Öffentliche API
 *
 * Grundsystem für persistente Lead-Speicherung.
 * Dashboard-Anbindung folgt in einem späteren Schritt.
 */

export {
  CRM_LEADS_TABLE,
  CRM_LEAD_STATUSES,
  CRM_LEAD_STATUS_LABELS,
  DEFAULT_CRM_LEAD_STATUS,
} from "./constants";

export type {
  CrmLead,
  CrmLeadListOptions,
  CrmLeadSource,
  CrmLeadStatus,
  CrmLeadSyncResult,
  CrmLeadUpsertInput,
} from "./types";

export {
  mapLeadDetectionToCrmInput,
  mapCrmLeadRow,
  mergeCrmLeadFields,
  shouldPersistCrmLead,
} from "./map-from-detection";

export {
  getCrmLeadById,
  getCrmLeadByEmail,
  getCrmLeadBySessionId,
  listCrmLeads,
  updateCrmLeadStatus,
  upsertCrmLead,
} from "./repository.server";

export { syncDetectedLeadToCrm } from "./sync-lead.server";

export type {
  CrmQuote,
  CrmQuoteDraft,
  CrmQuoteGenerateResult,
  CrmQuoteStatus,
} from "./quotes/types";

export {
  MIN_QUOTE_COMPLETENESS_SCORE,
  QUOTE_VALIDITY_DAYS,
} from "./quotes/constants";

export type {
  CrmEmailLog,
  CrmEmailTemplateId,
} from "./emails/types";

export {
  CRM_EMAIL_TEMPLATE_OPTIONS,
  CRM_EMAIL_STATUS_LABELS,
} from "./emails/index";

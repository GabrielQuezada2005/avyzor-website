/**
 * CRM – Konstanten
 */

import type { CrmLeadStatus } from "./types";

export const CRM_LEADS_TABLE = "crm_leads";

export const CRM_LEAD_STATUS_LABELS: Record<CrmLeadStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  angebot_gesendet: "Angebot gesendet",
  kunde: "Kunde",
  abgelehnt: "Abgelehnt",
};

export const CRM_LEAD_STATUSES = Object.keys(
  CRM_LEAD_STATUS_LABELS
) as CrmLeadStatus[];

export const DEFAULT_CRM_LEAD_STATUS: CrmLeadStatus = "neu";

export const DEFAULT_CRM_LEAD_SOURCE = "assistant" as const;

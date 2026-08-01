/**
 * CRM-E-Mail – Öffentliche API (client-sichere Exports)
 */

export {
  CRM_EMAIL_LOGS_TABLE,
  CRM_EMAIL_BODY_PREVIEW_MAX,
  CRM_EMAIL_PLACEHOLDER_KEYS,
} from "./constants";

export type {
  CrmEmailLog,
  CrmEmailLogStatus,
  CrmEmailProvider,
  CrmEmailSendInput,
  CrmEmailSendResult,
  CrmEmailTemplate,
  CrmEmailTemplateId,
} from "./types";

export {
  CRM_EMAIL_TEMPLATES,
  CRM_EMAIL_TEMPLATE_LIST,
  getCrmEmailTemplate,
} from "./templates";

export {
  applyPlaceholders,
  buildPlaceholderValues,
  stripHtml,
} from "./placeholders";

export const CRM_EMAIL_TEMPLATE_OPTIONS = [
  { id: "erstkontakt", label: "Erstkontakt" },
  { id: "angebot", label: "Angebot" },
  { id: "erinnerung", label: "Erinnerung" },
  { id: "dankeschoen", label: "Dankeschön nach Auftrag" },
] as const;

export const CRM_EMAIL_STATUS_LABELS: Record<string, string> = {
  sent: "Versendet",
  failed: "Fehlgeschlagen",
  skipped_not_configured: "Nicht konfiguriert",
  dry_run: "Testlauf",
};

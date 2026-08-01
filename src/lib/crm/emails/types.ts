/**
 * CRM-E-Mail – Typen
 */

export type CrmEmailTemplateId =
  | "erstkontakt"
  | "angebot"
  | "erinnerung"
  | "dankeschoen";

export type CrmEmailLogStatus =
  | "sent"
  | "failed"
  | "skipped_not_configured"
  | "dry_run";

export type CrmEmailProvider = "resend";

export interface CrmEmailTemplate {
  id: CrmEmailTemplateId;
  label: string;
  subject: string;
  body: string;
  attachQuotePdf: boolean;
}

export interface CrmEmailPlaceholderValues {
  Name: string;
  Firma: string;
  Dienstleistung: string;
  Angebotsnummer: string;
  Preis: string;
}

export interface CrmEmailLog {
  id: string;
  leadId: string;
  templateId: CrmEmailTemplateId;
  recipient: string;
  subject: string;
  status: CrmEmailLogStatus;
  provider: CrmEmailProvider | null;
  providerMessageId: string | null;
  errorMessage: string | null;
  hasAttachment: boolean;
  attachmentName: string | null;
  bodyPreview: string | null;
  createdAt: string;
}

export interface CrmEmailLogRow {
  id: string;
  lead_id: string;
  template_id: string;
  recipient: string;
  subject: string;
  status: string;
  provider: string | null;
  provider_message_id: string | null;
  error_message: string | null;
  has_attachment: boolean;
  attachment_name: string | null;
  body_preview: string | null;
  created_at: string;
}

export interface CrmEmailSendInput {
  leadId: string;
  templateId: CrmEmailTemplateId;
  recipient?: string;
  subjectOverride?: string;
  bodyOverride?: string;
}

export interface CrmEmailSendResult {
  success: boolean;
  log: CrmEmailLog;
  sent: boolean;
  message: string;
}

import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import { CRM_EMAIL_LOGS_TABLE } from "./constants";
import type {
  CrmEmailLog,
  CrmEmailLogRow,
  CrmEmailLogStatus,
  CrmEmailProvider,
  CrmEmailTemplateId,
} from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

function mapCrmEmailLogRow(row: CrmEmailLogRow): CrmEmailLog {
  return {
    id: row.id,
    leadId: row.lead_id,
    templateId: row.template_id as CrmEmailTemplateId,
    recipient: row.recipient,
    subject: row.subject,
    status: row.status as CrmEmailLogStatus,
    provider: row.provider as CrmEmailProvider | null,
    providerMessageId: row.provider_message_id,
    errorMessage: row.error_message,
    hasAttachment: row.has_attachment,
    attachmentName: row.attachment_name,
    bodyPreview: row.body_preview,
    createdAt: row.created_at,
  };
}

export interface CreateCrmEmailLogInput {
  leadId: string;
  templateId: CrmEmailTemplateId;
  recipient: string;
  subject: string;
  status: CrmEmailLogStatus;
  provider?: CrmEmailProvider | null;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  hasAttachment?: boolean;
  attachmentName?: string | null;
  bodyPreview?: string | null;
}

export async function createCrmEmailLog(
  input: CreateCrmEmailLogInput
): Promise<CrmEmailLog> {
  assertSupabaseReady();

  const { data, error } = await supabaseAdmin!
    .from(CRM_EMAIL_LOGS_TABLE)
    .insert({
      lead_id: input.leadId,
      template_id: input.templateId,
      recipient: input.recipient,
      subject: input.subject,
      status: input.status,
      provider: input.provider ?? null,
      provider_message_id: input.providerMessageId ?? null,
      error_message: input.errorMessage ?? null,
      has_attachment: input.hasAttachment ?? false,
      attachment_name: input.attachmentName ?? null,
      body_preview: input.bodyPreview ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`E-Mail-Protokoll speichern fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmEmailLogRow(data as CrmEmailLogRow);
}

export async function listCrmEmailLogsByLeadId(
  leadId: string
): Promise<CrmEmailLog[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_EMAIL_LOGS_TABLE)
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as CrmEmailLogRow[]).map(mapCrmEmailLogRow);
}

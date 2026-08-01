import "server-only";

import { isResendConfigured } from "@/lib/env";
import { getCrmLeadById } from "../repository.server";
import { generateQuotePdf } from "../quotes/generate-quote-pdf.server";
import { getCrmQuoteByLeadId } from "../quotes/repository.server";
import { CRM_EMAIL_BODY_PREVIEW_MAX } from "./constants";
import { createCrmEmailLog } from "./log-repository.server";
import {
  applyPlaceholders,
  buildPlaceholderValues,
  stripHtml,
} from "./placeholders";
import { getCrmEmailTemplate } from "./templates";
import type {
  CrmEmailSendInput,
  CrmEmailSendResult,
  CrmEmailTemplateId,
} from "./types";
import { sendCrmEmail } from "./transport.server";

const TEMPLATE_IDS: CrmEmailTemplateId[] = [
  "erstkontakt",
  "angebot",
  "erinnerung",
  "dankeschoen",
];

export function isValidCrmEmailTemplateId(
  value: string
): value is CrmEmailTemplateId {
  return TEMPLATE_IDS.includes(value as CrmEmailTemplateId);
}

function resolveRecipient(
  leadEmail: string | null,
  override?: string
): string | null {
  const email = (override ?? leadEmail)?.trim();
  if (!email || !email.includes("@")) return null;
  return email;
}

function buildBodyPreview(html: string): string {
  const plain = stripHtml(html);
  return plain.slice(0, CRM_EMAIL_BODY_PREVIEW_MAX);
}

/**
 * Versendet eine CRM-E-Mail an einen Lead und protokolliert das Ergebnis.
 * Ohne Resend-Konfiguration wird nichts versendet, aber protokolliert.
 */
export async function sendCrmLeadEmail(
  input: CrmEmailSendInput
): Promise<CrmEmailSendResult> {
  const lead = await getCrmLeadById(input.leadId);
  if (!lead) {
    throw new Error("Lead nicht gefunden.");
  }

  const recipient = resolveRecipient(lead.email, input.recipient);
  if (!recipient) {
    throw new Error("Keine gültige E-Mail-Adresse für diesen Lead vorhanden.");
  }

  const template = getCrmEmailTemplate(input.templateId);
  const quote = await getCrmQuoteByLeadId(lead.id);
  const placeholders = buildPlaceholderValues(lead, quote);

  const subject = applyPlaceholders(
    input.subjectOverride ?? template.subject,
    placeholders
  );
  const html = applyPlaceholders(
    input.bodyOverride ?? template.body,
    placeholders
  );

  let attachment: { filename: string; content: Buffer } | undefined;

  if (template.attachQuotePdf) {
    if (!quote) {
      throw new Error(
        "Für diese Vorlage ist ein Angebot erforderlich. Bitte zuerst Angebot generieren lassen."
      );
    }

    const pdfBuffer = await generateQuotePdf(quote);
    attachment = {
      filename: `${quote.quoteNumber}.pdf`,
      content: pdfBuffer,
    };
  }

  const bodyPreview = buildBodyPreview(html);

  if (!isResendConfigured()) {
    const log = await createCrmEmailLog({
      leadId: lead.id,
      templateId: input.templateId,
      recipient,
      subject,
      status: "skipped_not_configured",
      provider: null,
      errorMessage: "E-Mail-Service (Resend) ist nicht konfiguriert.",
      hasAttachment: Boolean(attachment),
      attachmentName: attachment?.filename ?? null,
      bodyPreview,
    });

    return {
      success: true,
      sent: false,
      log,
      message:
        "E-Mail protokolliert, aber nicht versendet (Resend nicht konfiguriert).",
    };
  }

  const sendResult = await sendCrmEmail({
    to: recipient,
    subject,
    html,
    replyTo: undefined,
    attachments: attachment ? [attachment] : undefined,
  });

  if (!sendResult.success) {
    const log = await createCrmEmailLog({
      leadId: lead.id,
      templateId: input.templateId,
      recipient,
      subject,
      status: "failed",
      provider: "resend",
      errorMessage: sendResult.error ?? "Versand fehlgeschlagen.",
      hasAttachment: Boolean(attachment),
      attachmentName: attachment?.filename ?? null,
      bodyPreview,
    });

    return {
      success: false,
      sent: false,
      log,
      message: sendResult.error ?? "E-Mail konnte nicht versendet werden.",
    };
  }

  const providerMessageId =
    typeof sendResult.data === "object" &&
    sendResult.data !== null &&
    "id" in sendResult.data
      ? String((sendResult.data as { id: string }).id)
      : null;

  const log = await createCrmEmailLog({
    leadId: lead.id,
    templateId: input.templateId,
    recipient,
    subject,
    status: "sent",
    provider: "resend",
    providerMessageId,
    hasAttachment: Boolean(attachment),
    attachmentName: attachment?.filename ?? null,
    bodyPreview,
  });

  return {
    success: true,
    sent: true,
    log,
    message: "E-Mail erfolgreich versendet.",
  };
}

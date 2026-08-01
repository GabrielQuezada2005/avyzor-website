import "server-only";

import { EMAIL_FROM, resend, type SendEmailResult } from "@/lib/resend";
import { isResendConfigured } from "@/lib/env";

export interface CrmEmailAttachment {
  filename: string;
  content: Buffer;
}

export interface CrmEmailTransportOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: CrmEmailAttachment[];
}

/**
 * CRM-E-Mail-Versand über Resend (mit optionalen Anhängen).
 * Ruft Resend nur auf, wenn konfiguriert.
 */
export async function sendCrmEmail(
  options: CrmEmailTransportOptions
): Promise<SendEmailResult> {
  if (!isResendConfigured() || !resend) {
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    });

    if (error) {
      console.error("[crm-email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[crm-email] Send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}

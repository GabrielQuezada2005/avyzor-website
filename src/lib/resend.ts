import { Resend } from "resend";
import { env, isResendConfigured } from "@/lib/env";

export const resend = isResendConfigured()
  ? new Resend(env.resend.apiKey)
  : null;

export const EMAIL_FROM = env.resend.from;
export const EMAIL_TO = env.resend.to;

export interface SendEmailResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  if (!resend) {
    console.error("Resend not configured – email not sent:", subject);
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}

export function contactConfirmationEmail(name: string): string {
  const safeName = escapeHtml(name);
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #C9A227;border-radius:12px;overflow:hidden;">
            <tr><td style="background:linear-gradient(135deg,#C9A227,#FFE080);padding:30px;text-align:center;">
              <h1 style="margin:0;color:#0A0A0A;font-size:28px;letter-spacing:4px;">AVYZOR</h1>
            </td></tr>
            <tr><td style="padding:40px 30px;">
              <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Vielen Dank, ${safeName}!</h2>
              <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
                Ihre Nachricht ist bei uns eingegangen. Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.
              </p>
              <p style="color:#999999;line-height:1.6;margin:0;">
                Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
              </p>
            </td></tr>
            <tr><td style="padding:20px 30px;border-top:1px solid #2E2E2E;text-align:center;">
              <p style="color:#666666;font-size:12px;margin:0;">© ${new Date().getFullYear()} AVYZOR – Premium KI-Agentur</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

export function newsletterConfirmationEmail(
  confirmUrl: string
): string {
  const safeUrl = escapeHtml(confirmUrl);
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #C9A227;border-radius:12px;overflow:hidden;">
            <tr><td style="background:linear-gradient(135deg,#C9A227,#FFE080);padding:30px;text-align:center;">
              <h1 style="margin:0;color:#0A0A0A;font-size:28px;letter-spacing:4px;">AVYZOR</h1>
            </td></tr>
            <tr><td style="padding:40px 30px;">
              <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Newsletter bestätigen</h2>
              <p style="color:#CCCCCC;line-height:1.6;margin:0 0 24px;">
                Vielen Dank für Ihr Interesse! Bitte bestätigen Sie Ihre Anmeldung, indem Sie auf den Button klicken:
              </p>
              <p style="text-align:center;margin:0 0 24px;">
                <a href="${safeUrl}" style="display:inline-block;background:linear-gradient(135deg,#C9A227,#FFE080);color:#0A0A0A;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;">
                  Anmeldung bestätigen
                </a>
              </p>
              <p style="color:#999999;line-height:1.6;margin:0;font-size:13px;">
                Falls Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail.
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

export function adminNotificationEmail(
  type: string,
  data: Record<string, string>
): string {
  const rows = Object.entries(data)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;color:#999;border-bottom:1px solid #2E2E2E;font-weight:bold;text-transform:capitalize;">${escapeHtml(key)}</td><td style="padding:8px 12px;color:#CCCCCC;border-bottom:1px solid #2E2E2E;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #C9A227;border-radius:12px;">
            <tr><td style="padding:30px;">
              <h2 style="color:#C9A227;margin:0 0 20px;">Neue ${escapeHtml(type)}</h2>
              <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

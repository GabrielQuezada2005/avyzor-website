/**
 * Terminbuchung – Bestätigungs-E-Mail
 */

import { escapeHtml } from "@/lib/resend";
import type { BookingConfirmationPlaceholders } from "./types";

function emailShell(content: string): string {
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
              ${content}
            </td></tr>
            <tr><td style="padding:20px 30px;border-top:1px solid #2E2E2E;text-align:center;">
              <p style="color:#666666;font-size:12px;margin:0;">© ${new Date().getFullYear()} AVYZOR – Premium KI-Agentur</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `.trim();
}

const SUBJECT_TEMPLATE =
  "Terminbestätigung: {{Datum}} um {{Uhrzeit}} – AVYZOR";

const BODY_TEMPLATE = emailShell(`
  <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Guten Tag {{Name}},</h2>
  <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
    vielen Dank für Ihre Terminbuchung bei AVYZOR. Wir bestätigen hiermit Ihren Termin:
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr>
      <td style="padding:8px 0;color:#999999;font-size:14px;">Datum</td>
      <td style="padding:8px 0;color:#FFFFFF;font-size:14px;text-align:right;">{{Datum}}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#999999;font-size:14px;">Uhrzeit</td>
      <td style="padding:8px 0;color:#FFFFFF;font-size:14px;text-align:right;">{{Uhrzeit}} Uhr</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#999999;font-size:14px;">Leistung</td>
      <td style="padding:8px 0;color:#FFFFFF;font-size:14px;text-align:right;">{{Dienstleistung}}</td>
    </tr>
  </table>
  <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
    Sollten Sie den Termin verschieben oder absagen müssen, antworten Sie bitte auf diese E-Mail
    oder kontaktieren Sie uns direkt.
  </p>
  <p style="color:#999999;line-height:1.6;margin:0;">
    Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
  </p>
`);

function applyPlaceholders(
  template: string,
  values: BookingConfirmationPlaceholders
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const typedKey = key as keyof BookingConfirmationPlaceholders;
    const value = values[typedKey] ?? "";
    return escapeHtml(value);
  });
}

export function buildBookingConfirmationEmail(
  placeholders: BookingConfirmationPlaceholders
): { subject: string; html: string } {
  return {
    subject: applyPlaceholders(SUBJECT_TEMPLATE, placeholders),
    html: applyPlaceholders(BODY_TEMPLATE, placeholders),
  };
}

export function formatBookingDateGerman(isoDate: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
  }).format(new Date(`${isoDate}T12:00:00`));
}

export function buildBookingConfirmationPlaceholders(input: {
  name: string;
  company?: string | null;
  service?: string | null;
  date: string;
  time: string;
}): BookingConfirmationPlaceholders {
  return {
    Name: input.name,
    Firma: input.company?.trim() || "Ihr Unternehmen",
    Dienstleistung: input.service?.trim() || "Beratungsgespräch",
    Datum: formatBookingDateGerman(input.date),
    Uhrzeit: input.time,
  };
}

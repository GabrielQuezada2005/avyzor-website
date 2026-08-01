/**
 * CRM-E-Mail – Vorlagen
 *
 * Platzhalter: {{Name}}, {{Firma}}, {{Dienstleistung}}, {{Angebotsnummer}}, {{Preis}}
 */

import type { CrmEmailTemplate, CrmEmailTemplateId } from "./types";

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

export const CRM_EMAIL_TEMPLATES: Record<CrmEmailTemplateId, CrmEmailTemplate> = {
  erstkontakt: {
    id: "erstkontakt",
    label: "Erstkontakt",
    subject: "Ihre Anfrage zu {{Dienstleistung}} – AVYZOR",
    attachQuotePdf: false,
    body: emailShell(`
      <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Guten Tag {{Name}},</h2>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        vielen Dank für Ihr Interesse an AVYZOR. Wir haben Ihre Anfrage zu
        <strong style="color:#FFFFFF;">{{Dienstleistung}}</strong> für {{Firma}} erhalten.
      </p>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        Gerne melden wir uns in Kürze persönlich bei Ihnen, um Ihr Projekt und Ihre Ziele im Detail zu besprechen.
      </p>
      <p style="color:#999999;line-height:1.6;margin:0;">
        Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
      </p>
    `),
  },
  angebot: {
    id: "angebot",
    label: "Angebot",
    subject: "Ihr Angebot {{Angebotsnummer}} – {{Dienstleistung}}",
    attachQuotePdf: true,
    body: emailShell(`
      <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Guten Tag {{Name}},</h2>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        wie besprochen erhalten Sie im Anhang unser Angebot
        <strong style="color:#FFFFFF;">{{Angebotsnummer}}</strong> für
        <strong style="color:#FFFFFF;">{{Dienstleistung}}</strong> ({{Firma}}).
      </p>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        Der Beispielpreis für das beschriebene Leistungspaket beträgt
        <strong style="color:#C9A227;">{{Preis}}</strong> (zzgl. gesetzlicher MwSt.).
      </p>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        Bei Fragen oder für eine individuelle Anpassung stehen wir Ihnen jederzeit gerne zur Verfügung.
      </p>
      <p style="color:#999999;line-height:1.6;margin:0;">
        Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
      </p>
    `),
  },
  erinnerung: {
    id: "erinnerung",
    label: "Erinnerung",
    subject: "Erinnerung: Ihr Angebot {{Angebotsnummer}} – AVYZOR",
    attachQuotePdf: false,
    body: emailShell(`
      <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Guten Tag {{Name}},</h2>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        wir möchten freundlich an unser Angebot
        <strong style="color:#FFFFFF;">{{Angebotsnummer}}</strong> für
        {{Dienstleistung}} erinnern.
      </p>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        Haben Sie noch Fragen oder wünschen Sie eine Anpassung? Wir freuen uns auf Ihre Rückmeldung.
      </p>
      <p style="color:#999999;line-height:1.6;margin:0;">
        Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
      </p>
    `),
  },
  dankeschoen: {
    id: "dankeschoen",
    label: "Dankeschön nach Auftrag",
    subject: "Vielen Dank für Ihr Vertrauen – {{Firma}}",
    attachQuotePdf: false,
    body: emailShell(`
      <h2 style="color:#C9A227;margin:0 0 20px;font-size:22px;">Liebe/r {{Name}},</h2>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        vielen Dank für Ihren Auftrag und Ihr Vertrauen in AVYZOR. Wir freuen uns sehr auf die
        Zusammenarbeit mit {{Firma}} am Projekt
        <strong style="color:#FFFFFF;">{{Dienstleistung}}</strong>.
      </p>
      <p style="color:#CCCCCC;line-height:1.6;margin:0 0 15px;">
        In den nächsten Schritten meldet sich Ihr persönlicher Ansprechpartner mit dem
        detaillierten Projektplan und den nächsten Meilensteinen.
      </p>
      <p style="color:#999999;line-height:1.6;margin:0;">
        Mit premium Grüßen,<br><strong style="color:#C9A227;">Ihr AVYZOR Team</strong>
      </p>
    `),
  },
};

export const CRM_EMAIL_TEMPLATE_LIST = Object.values(CRM_EMAIL_TEMPLATES);

export function getCrmEmailTemplate(
  templateId: CrmEmailTemplateId
): CrmEmailTemplate {
  const template = CRM_EMAIL_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unbekannte E-Mail-Vorlage: ${templateId}`);
  }
  return template;
}

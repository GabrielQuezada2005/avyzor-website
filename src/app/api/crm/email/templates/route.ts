import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { CRM_EMAIL_TEMPLATE_LIST } from "@/lib/crm/emails/templates";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  const templates = CRM_EMAIL_TEMPLATE_LIST.map((template) => ({
    id: template.id,
    label: template.label,
    subject: template.subject,
    attachQuotePdf: template.attachQuotePdf,
    placeholders: ["Name", "Firma", "Dienstleistung", "Angebotsnummer", "Preis"],
  }));

  return NextResponse.json({ success: true, templates });
}

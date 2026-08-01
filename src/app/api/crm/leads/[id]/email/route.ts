import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import {
  isValidCrmEmailTemplateId,
  sendCrmLeadEmail,
} from "@/lib/crm/emails/send-email.server";
import { listCrmEmailLogsByLeadId } from "@/lib/crm/emails/log-repository.server";
import { getCrmLeadById } from "@/lib/crm/repository.server";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  const lead = await getCrmLeadById(params.id);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead nicht gefunden." },
      { status: 404 }
    );
  }

  const logs = await listCrmEmailLogsByLeadId(params.id);
  return NextResponse.json({ success: true, logs });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      templateId?: string;
      recipient?: string;
      subjectOverride?: string;
      bodyOverride?: string;
    };

    if (!body.templateId || !isValidCrmEmailTemplateId(body.templateId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige E-Mail-Vorlage." },
        { status: 400 }
      );
    }

    const result = await sendCrmLeadEmail({
      leadId: params.id,
      templateId: body.templateId,
      recipient: body.recipient,
      subjectOverride: body.subjectOverride,
      bodyOverride: body.bodyOverride,
    });

    return NextResponse.json({
      success: result.success,
      sent: result.sent,
      message: result.message,
      log: result.log,
    });
  } catch (error) {
    console.error("[crm-email] Versand fehlgeschlagen:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "E-Mail konnte nicht verarbeitet werden.",
      },
      { status: 500 }
    );
  }
}

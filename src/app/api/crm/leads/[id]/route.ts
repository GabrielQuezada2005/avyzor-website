import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { CRM_LEAD_STATUSES } from "@/lib/crm/constants";
import {
  getCrmLeadById,
  updateCrmLeadStatus,
} from "@/lib/crm/repository.server";
import type { CrmLeadStatus } from "@/lib/crm/types";
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

  return NextResponse.json({ success: true, lead });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const body = (await request.json()) as { status?: string };
    const status = body.status as CrmLeadStatus | undefined;

    if (!status || !CRM_LEAD_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Ungültiger Status." },
        { status: 400 }
      );
    }

    const lead = await updateCrmLeadStatus(params.id, status);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[crm] Status-Update fehlgeschlagen:", error);
    return NextResponse.json(
      { success: false, error: "Status konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

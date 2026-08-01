import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { getCrmLeadById } from "@/lib/crm/repository.server";
import { getCrmQuoteByLeadId } from "@/lib/crm/quotes/repository.server";
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

  const quote = await getCrmQuoteByLeadId(params.id);
  if (!quote) {
    return NextResponse.json(
      {
        success: false,
        error: "Für diesen Lead liegt noch kein Angebot vor.",
        code: "QUOTE_NOT_FOUND",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, quote });
}

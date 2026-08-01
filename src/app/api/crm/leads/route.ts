import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { CRM_LEAD_STATUSES } from "@/lib/crm/constants";
import { listCrmLeads } from "@/lib/crm/repository.server";
import type { CrmLeadStatus } from "@/lib/crm/types";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

function parseStatus(value: string | null): CrmLeadStatus | undefined {
  if (!value || value === "all") return undefined;
  return CRM_LEAD_STATUSES.includes(value as CrmLeadStatus)
    ? (value as CrmLeadStatus)
    : undefined;
}

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase ist nicht konfiguriert.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = parseStatus(searchParams.get("status"));
    const search = searchParams.get("search") ?? undefined;

    const leads = await listCrmLeads({ status, search });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("[crm] Leads laden fehlgeschlagen:", error);
    return NextResponse.json(
      { success: false, error: "Leads konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

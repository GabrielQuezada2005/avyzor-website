import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { getAdminDashboardStats } from "@/lib/admin/stats.server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Statistiken konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

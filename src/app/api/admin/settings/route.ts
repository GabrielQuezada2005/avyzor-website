import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { getAdminServiceStatus } from "@/lib/admin/stats.server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  return NextResponse.json({
    success: true,
    services: getAdminServiceStatus(),
  });
}

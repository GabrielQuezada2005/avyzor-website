import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { listAllCrmPayments } from "@/lib/payments/repository.server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  try {
    const payments = await listAllCrmPayments();
    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Admin payments error:", error);
    return NextResponse.json(
      { success: false, error: "Zahlungen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

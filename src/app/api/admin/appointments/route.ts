import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { listAllAppointments } from "@/lib/booking/repository.server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  try {
    const appointments = await listAllAppointments();
    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("Admin appointments error:", error);
    return NextResponse.json(
      { success: false, error: "Termine konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

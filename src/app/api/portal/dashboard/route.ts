import { NextRequest, NextResponse } from "next/server";
import {
  portalUnauthorizedResponse,
  requirePortalSession,
} from "@/lib/portal/guards.server";
import { getPortalDataForSession } from "@/lib/portal/data.server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requirePortalSession(request);
  if (!session) return portalUnauthorizedResponse();

  const data = await getPortalDataForSession(session);

  return NextResponse.json({
    success: true,
    user: data.user,
    offers: data.offers,
    appointments: data.appointments,
    invoices: data.invoices,
    project: data.project,
    messages: data.messages,
  });
}

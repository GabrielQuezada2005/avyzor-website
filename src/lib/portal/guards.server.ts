import "server-only";

import { NextResponse } from "next/server";
import { getPortalSessionFromRequest } from "./session.server";
import type { PortalRole, PortalSession } from "./types";

export function portalUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Nicht autorisiert.", code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

export function portalForbiddenResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Zugriff verweigert.", code: "FORBIDDEN" },
    { status: 403 }
  );
}

export async function requirePortalSession(
  request: Request
): Promise<PortalSession | null> {
  return getPortalSessionFromRequest(request);
}

export function hasPortalRole(
  session: PortalSession,
  roles: PortalRole[]
): boolean {
  return roles.includes(session.role);
}

export function canAccessLeadData(
  session: PortalSession,
  leadId: string | null
): boolean {
  if (session.role === "admin" || session.role === "employee") {
    return true;
  }

  if (!leadId || !session.leadId) return false;
  return session.leadId === leadId;
}

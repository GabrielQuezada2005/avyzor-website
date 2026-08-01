import "server-only";

import { getCrmAdminSecret, isCrmAdminConfigured } from "@/lib/env.server";

export function validateCrmAdminRequest(request: Request): boolean {
  if (!isCrmAdminConfigured()) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7).trim();
  return token.length > 0 && token === getCrmAdminSecret();
}

export function crmAdminUnauthorizedResponse(): Response {
  return Response.json(
    { success: false, error: "Nicht autorisiert.", code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

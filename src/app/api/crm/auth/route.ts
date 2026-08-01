import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/api/security";
import { crmAuthSchema } from "@/lib/validations";
import {
  getCrmAdminSecret,
  isCrmAdminConfigured,
} from "@/lib/env.server";
import { logWarn } from "@/lib/logging/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, "auth", "crm-auth")) {
    return rateLimitResponse();
  }

  if (!isCrmAdminConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "CRM_ADMIN_SECRET ist nicht konfiguriert.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = crmAuthSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Ungültige Anfrage.", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const password = parsed.data.password.trim();

    if (password !== getCrmAdminSecret()) {
      logWarn("CRM admin login failed", {
        ip: request.headers.get("x-forwarded-for") ?? "unknown",
      });
      return NextResponse.json(
        { success: false, error: "Ungültiges Passwort.", code: "INVALID_PASSWORD" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: getCrmAdminSecret(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Ungültige Anfrage.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }
}

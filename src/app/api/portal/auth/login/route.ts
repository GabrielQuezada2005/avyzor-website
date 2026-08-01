import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/api/security";
import { portalLoginSchema } from "@/lib/validations";
import { isPortalAuthConfigured } from "@/lib/env.server";
import { isSupabaseConfigured } from "@/lib/env";
import { authenticatePortalUser } from "@/lib/portal/repository.server";
import { setPortalSessionCookie } from "@/lib/portal/session.server";
import { logError, logWarn } from "@/lib/logging/server";
import type { PortalSession } from "@/lib/portal/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, "auth", "portal-login")) {
    return rateLimitResponse();
  }

  if (!isPortalAuthConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Kundenportal ist noch nicht konfiguriert.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Datenbank ist nicht konfiguriert.",
        code: "NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = portalLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Ungültige Anmeldedaten." },
        { status: 400 }
      );
    }

    const user = await authenticatePortalUser(
      parsed.data.email,
      parsed.data.password
    );

    if (!user) {
      logWarn("Portal login failed", {
        email: parsed.data.email,
        ip: request.headers.get("x-forwarded-for") ?? "unknown",
      });
      return NextResponse.json(
        { success: false, error: "E-Mail oder Passwort ist falsch." },
        { status: 401 }
      );
    }

    const session: PortalSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      leadId: user.leadId,
    };

    await setPortalSessionCookie(session);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logError("Portal login failed", error);
    return NextResponse.json(
      { success: false, error: "Anmeldung fehlgeschlagen." },
      { status: 500 }
    );
  }
}

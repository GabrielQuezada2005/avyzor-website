import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/api/security";
import { portalRegisterSchema } from "@/lib/validations";
import { isPortalAuthConfigured } from "@/lib/env.server";
import { isSupabaseConfigured } from "@/lib/env";
import { registerPortalUser } from "@/lib/portal/repository.server";
import { setPortalSessionCookie } from "@/lib/portal/session.server";
import { logError } from "@/lib/logging/server";
import type { PortalSession } from "@/lib/portal/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, "auth", "portal-register")) {
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
    const parsed = portalRegisterSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.errors) {
        const key = issue.path[0];
        if (typeof key === "string") errors[key] = issue.message;
      }
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const user = await registerPortalUser(parsed.data);

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
    logError("Portal registration failed", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Registrierung fehlgeschlagen.",
      },
      { status: 500 }
    );
  }
}

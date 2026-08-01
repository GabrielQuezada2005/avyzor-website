import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  isDebugEndpointEnabled,
  rateLimitResponse,
} from "@/lib/api/security";
import {
  logTtsDebugReport,
  type TtsDebugReport,
} from "@/lib/assistant/tts/tts-debug-log";

export const runtime = "nodejs";

/** Empfängt Client-Debug-Reports – nur in Dev oder mit ENABLE_DEBUG_ENDPOINTS=true. */
export async function POST(request: NextRequest) {
  if (!isDebugEndpointEnabled()) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  if (!checkRateLimit(request, "strict")) {
    return rateLimitResponse();
  }

  try {
    const report = (await request.json()) as TtsDebugReport;
    logTtsDebugReport({ ...report, phase: report.phase ?? "client" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

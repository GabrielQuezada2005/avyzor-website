import { NextRequest } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function checkRateLimit(request: NextRequest): boolean {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const honeypot = body.website ?? body._gotcha ?? body.url;
  return typeof honeypot === "string" && honeypot.length > 0;
}

export function rateLimitResponse() {
  return Response.json(
    {
      success: false,
      error: "Zu viele Anfragen. Bitte warten Sie einen Moment.",
      code: "RATE_LIMITED",
    },
    { status: 429 }
  );
}

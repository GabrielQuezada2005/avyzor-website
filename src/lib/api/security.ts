import { NextRequest } from "next/server";

export type RateLimitProfile = "default" | "auth" | "strict";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMIT_PROFILES: Record<RateLimitProfile, RateLimitConfig> = {
  default: { windowMs: 60_000, maxRequests: 10 },
  auth: { windowMs: 15 * 60_000, maxRequests: 5 },
  strict: { windowMs: 60_000, maxRequests: 3 },
};

/** In-Memory Store – für Vercel Serverless durch Upstash/KV ersetzbar. */
const rateLimitStore = new Map<string, RateLimitEntry>();

let cleanupCounter = 0;

function cleanupExpiredEntries(now: number): void {
  cleanupCounter += 1;
  if (cleanupCounter % 100 !== 0) return;

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  });
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function checkRateLimit(
  request: NextRequest,
  profile: RateLimitProfile = "default",
  keySuffix?: string
): boolean {
  const config = RATE_LIMIT_PROFILES[profile];
  const ip = getClientIp(request);
  const key = `${profile}:${keySuffix ?? ip}`;
  const now = Date.now();

  cleanupExpiredEntries(now);

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.maxRequests) {
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

/** Prüft, ob Debug-Endpunkte in Production erlaubt sind. */
export function isDebugEndpointEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.ENABLE_DEBUG_ENDPOINTS === "true";
}

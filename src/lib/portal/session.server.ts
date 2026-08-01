import "server-only";

import { cookies } from "next/headers";
import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from "./constants";
import {
  createPortalSessionToken,
  verifyPortalSessionToken,
} from "./auth.server";
import type { PortalSession } from "./types";

export async function setPortalSessionCookie(
  session: PortalSession
): Promise<void> {
  const token = await createPortalSessionToken(session);
  cookies().set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
  });
}

export function clearPortalSessionCookie(): void {
  cookies().set(PORTAL_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getPortalSessionFromCookies(): Promise<PortalSession | null> {
  const token = cookies().get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyPortalSessionToken(token);
}

export async function getPortalSessionFromRequest(
  request: Request
): Promise<PortalSession | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PORTAL_SESSION_COOKIE}=`));

  if (!match) return null;

  const token = match.slice(PORTAL_SESSION_COOKIE.length + 1);
  return verifyPortalSessionToken(decodeURIComponent(token));
}

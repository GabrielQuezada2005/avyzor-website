import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getPortalAuthSecret, isPortalAuthConfigured } from "@/lib/env.server";
import { PORTAL_SESSION_MAX_AGE_SECONDS } from "./constants";
import type { PortalSession } from "./types";

const BCRYPT_ROUNDS = 12;

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getPortalAuthSecret());
}

export function assertPortalAuthConfigured(): void {
  if (!isPortalAuthConfigured()) {
    throw new Error("PORTAL_AUTH_SECRET ist nicht konfiguriert.");
  }
}

export async function hashPortalPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPortalPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function createPortalSessionToken(
  session: PortalSession
): Promise<string> {
  assertPortalAuthConfigured();

  return new SignJWT({
    sub: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    leadId: session.leadId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PORTAL_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyPortalSessionToken(
  token: string
): Promise<PortalSession | null> {
  if (!isPortalAuthConfigured()) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const role = payload.role;
    const leadId = payload.leadId;

    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof role !== "string"
    ) {
      return null;
    }

    return {
      userId,
      email,
      name,
      role: role as PortalSession["role"],
      leadId: typeof leadId === "string" ? leadId : null,
    };
  } catch {
    return null;
  }
}

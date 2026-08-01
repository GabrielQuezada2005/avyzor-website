/**
 * Kundenportal – Konstanten
 */

import type { PortalRole } from "./types";

export const PORTAL_USERS_TABLE = "portal_users";

export const PORTAL_SESSION_COOKIE = "portal_session";

export const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const PORTAL_ROLES: PortalRole[] = ["admin", "employee", "customer"];

export const PORTAL_ROLE_LABELS: Record<PortalRole, string> = {
  admin: "Administrator",
  employee: "Mitarbeiter",
  customer: "Kunde",
};

export const PORTAL_MIN_PASSWORD_LENGTH = 8;

export const PORTAL_PUBLIC_PATHS = ["/portal/login", "/portal/register"];

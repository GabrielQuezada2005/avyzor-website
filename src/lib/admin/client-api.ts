import type { AdminDashboardStats, AdminServiceStatus } from "@/lib/admin/types";

const TOKEN_KEY = "crm_admin_token";

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleUnauthorized(response: Response): void {
  if (response.status === 401 && typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
    throw new Error("SESSION_EXPIRED");
  }
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  const response = await fetch("/api/admin/stats", { headers: authHeaders() });
  handleUnauthorized(response);

  const data = (await response.json()) as {
    success: boolean;
    stats?: AdminDashboardStats;
    error?: string;
  };

  if (!response.ok || !data.success || !data.stats) {
    throw new Error(data.error ?? "Statistiken konnten nicht geladen werden.");
  }

  return data.stats;
}

export async function fetchAdminServiceStatus(): Promise<AdminServiceStatus> {
  const response = await fetch("/api/admin/settings", { headers: authHeaders() });
  handleUnauthorized(response);

  const data = (await response.json()) as {
    success: boolean;
    services?: AdminServiceStatus;
    error?: string;
  };

  if (!response.ok || !data.success || !data.services) {
    throw new Error(data.error ?? "Einstellungen konnten nicht geladen werden.");
  }

  return data.services;
}

export function formatAdminCurrency(amountCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

export function formatAdminDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatAdminDateOnly(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

// Re-export CRM auth helpers for unified admin login
export {
  clearCrmAdminToken,
  getCrmAdminToken,
  loginCrmAdmin,
} from "@/lib/crm/client-api";

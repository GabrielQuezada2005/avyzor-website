import type { PortalDashboardData, PortalSession } from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

export async function loginPortal(input: {
  email: string;
  password: string;
}): Promise<void> {
  const response = await fetch("/api/portal/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await parseJson<{ success: boolean; error?: string }>(response);
  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Anmeldung fehlgeschlagen.");
  }
}

export async function registerPortal(input: {
  name: string;
  email: string;
  password: string;
  company?: string;
}): Promise<void> {
  const response = await fetch("/api/portal/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await parseJson<{
    success: boolean;
    error?: string;
    errors?: Record<string, string>;
  }>(response);

  if (!response.ok || !data.success) {
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }
    throw new Error(data.error ?? "Registrierung fehlgeschlagen.");
  }
}

export async function logoutPortal(): Promise<void> {
  await fetch("/api/portal/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchPortalDashboard(): Promise<PortalDashboardData> {
  const response = await fetch("/api/portal/dashboard", {
    credentials: "include",
  });

  const data = await parseJson<
    PortalDashboardData & { success: boolean; error?: string }
  >(response);

  if (response.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Daten konnten nicht geladen werden.");
  }

  return {
    user: data.user,
    offers: data.offers,
    appointments: data.appointments,
    invoices: data.invoices,
    project: data.project,
    messages: data.messages,
  };
}

export function formatPortalDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatPortalDateOnly(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(
    new Date(`${iso}T12:00:00`)
  );
}

export function formatPortalCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type { PortalSession };

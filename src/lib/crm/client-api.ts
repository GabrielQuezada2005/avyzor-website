import type { CrmLead, CrmLeadStatus } from "@/lib/crm/types";
import type { CrmEmailLog, CrmEmailTemplateId } from "@/lib/crm/emails/types";
import type { CrmPayment } from "@/lib/payments";

const TOKEN_KEY = "crm_admin_token";

export function getCrmAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setCrmAdminToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearCrmAdminToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const token = getCrmAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginCrmAdmin(password: string): Promise<void> {
  const response = await fetch("/api/crm/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = (await response.json()) as {
    success: boolean;
    token?: string;
    error?: string;
  };

  if (!response.ok || !data.success || !data.token) {
    throw new Error(data.error ?? "Anmeldung fehlgeschlagen.");
  }

  setCrmAdminToken(data.token);
}

export async function fetchCrmLeads(options?: {
  status?: CrmLeadStatus | "all";
  search?: string;
}): Promise<CrmLead[]> {
  const params = new URLSearchParams();
  if (options?.status && options.status !== "all") {
    params.set("status", options.status);
  }
  if (options?.search?.trim()) {
    params.set("search", options.search.trim());
  }

  const query = params.toString();
  const response = await fetch(`/api/crm/leads${query ? `?${query}` : ""}`, {
    headers: authHeaders(),
  });

  const data = (await response.json()) as {
    success: boolean;
    leads?: CrmLead[];
    error?: string;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success || !data.leads) {
    throw new Error(data.error ?? "Leads konnten nicht geladen werden.");
  }

  return data.leads;
}

export async function updateCrmLeadStatusClient(
  id: string,
  status: CrmLeadStatus
): Promise<CrmLead> {
  const response = await fetch(`/api/crm/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  const data = (await response.json()) as {
    success: boolean;
    lead?: CrmLead;
    error?: string;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success || !data.lead) {
    throw new Error(data.error ?? "Status konnte nicht aktualisiert werden.");
  }

  return data.lead;
}

export function formatCrmDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export async function fetchCrmEmailLogs(leadId: string): Promise<CrmEmailLog[]> {
  const response = await fetch(`/api/crm/leads/${leadId}/email`, {
    headers: authHeaders(),
  });

  const data = (await response.json()) as {
    success: boolean;
    logs?: CrmEmailLog[];
    error?: string;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success || !data.logs) {
    throw new Error(data.error ?? "E-Mail-Protokoll konnte nicht geladen werden.");
  }

  return data.logs;
}

export async function sendCrmLeadEmail(
  leadId: string,
  templateId: CrmEmailTemplateId
): Promise<{
  success: boolean;
  sent: boolean;
  message: string;
  log: CrmEmailLog;
}> {
  const response = await fetch(`/api/crm/leads/${leadId}/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ templateId }),
  });

  const data = (await response.json()) as {
    success: boolean;
    sent?: boolean;
    message?: string;
    log?: CrmEmailLog;
    error?: string;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.log) {
    throw new Error(data.error ?? "E-Mail konnte nicht gesendet werden.");
  }

  return {
    success: data.success,
    sent: data.sent ?? false,
    message: data.message ?? "",
    log: data.log,
  };
}

export function formatCrmCurrency(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export async function fetchCrmLeadPayments(leadId: string): Promise<CrmPayment[]> {
  const response = await fetch(`/api/crm/leads/${leadId}/payments`, {
    headers: authHeaders(),
  });

  const data = (await response.json()) as {
    success: boolean;
    payments?: CrmPayment[];
    error?: string;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success || !data.payments) {
    throw new Error(data.error ?? "Zahlungen konnten nicht geladen werden.");
  }

  return data.payments;
}

export async function createCrmLeadPaymentLink(leadId: string): Promise<{
  url: string;
  payment?: CrmPayment;
}> {
  const response = await fetch(`/api/crm/leads/${leadId}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  const data = (await response.json()) as {
    success: boolean;
    url?: string;
    payment?: CrmPayment;
    error?: string;
    fallback?: boolean;
  };

  if (response.status === 401) {
    clearCrmAdminToken();
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok || !data.success || !data.url) {
    throw new Error(data.error ?? "Zahlungslink konnte nicht erstellt werden.");
  }

  return { url: data.url, payment: data.payment };
}

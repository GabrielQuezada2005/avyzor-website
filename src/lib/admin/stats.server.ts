import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import {
  isResendConfigured,
  isStripeConfigured,
  isSupabaseConfigured,
} from "@/lib/env";
import {
  isCrmAdminConfigured,
  isPortalAuthConfigured,
} from "@/lib/env.server";
import { CRM_LEADS_TABLE } from "@/lib/crm/constants";
import { CRM_QUOTES_TABLE } from "@/lib/crm/quotes/constants";
import { CRM_APPOINTMENTS_TABLE } from "@/lib/booking/config";
import { CRM_PAYMENTS_TABLE } from "@/lib/payments/constants";
import type { AdminDashboardStats, AdminServiceStatus } from "./types";

async function countRows(
  table: string,
  filters?: { column: string; value: string }[]
): Promise<number> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return 0;

  let query = supabaseAdmin.from(table).select("*", { count: "exact", head: true });

  for (const filter of filters ?? []) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;
  if (error) return 0;
  return count ?? 0;
}

async function sumSucceededRevenueCents(): Promise<number> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return 0;

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("amount_cents")
    .eq("status", "succeeded");

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + (row.amount_cents as number), 0);
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [newLeads, activeCustomers, quotes, appointments, revenueCents] =
    await Promise.all([
      countRows(CRM_LEADS_TABLE, [{ column: "status", value: "neu" }]),
      countRows(CRM_LEADS_TABLE, [{ column: "status", value: "kunde" }]),
      countRows(CRM_QUOTES_TABLE),
      countRows(CRM_APPOINTMENTS_TABLE, [{ column: "status", value: "confirmed" }]),
      sumSucceededRevenueCents(),
    ]);

  const hasPaymentsTable = isSupabaseConfigured();
  const revenueIsPlaceholder = !hasPaymentsTable || revenueCents === 0;

  return {
    newLeads,
    activeCustomers,
    quotes,
    appointments,
    revenueCents,
    revenueIsPlaceholder,
    updatedAt: new Date().toISOString(),
  };
}

export function getAdminServiceStatus(): AdminServiceStatus {
  return {
    supabase: isSupabaseConfigured(),
    stripe: isStripeConfigured(),
    resend: isResendConfigured(),
    portal: isPortalAuthConfigured(),
    crm: isCrmAdminConfigured(),
  };
}

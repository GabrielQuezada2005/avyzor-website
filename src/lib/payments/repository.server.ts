import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
import { CRM_PAYMENTS_TABLE } from "./constants";
import type {
  CreateCrmPaymentInput,
  CrmPayment,
  CrmPaymentRow,
  UpdateCrmPaymentInput,
} from "./types";

function assertSupabaseReady(): void {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
}

export function mapCrmPaymentRow(row: CrmPaymentRow): CrmPayment {
  return {
    id: row.id,
    leadId: row.lead_id,
    quoteId: row.quote_id,
    invoiceId: row.invoice_id,
    referenceType: row.reference_type as CrmPayment["referenceType"],
    referenceId: row.reference_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status as CrmPayment["status"],
    paymentMethod: row.payment_method as CrmPayment["paymentMethod"],
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    stripeCustomerId: row.stripe_customer_id,
    description: row.description,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createCrmPayment(
  input: CreateCrmPaymentInput
): Promise<CrmPayment> {
  assertSupabaseReady();

  const payload = {
    lead_id: input.leadId ?? null,
    quote_id: input.quoteId ?? null,
    invoice_id: input.invoiceId ?? null,
    reference_type: input.referenceType,
    reference_id: input.referenceId ?? null,
    amount_cents: input.amountCents,
    currency: input.currency ?? "EUR",
    status: "pending",
    description: input.description ?? null,
    metadata: input.metadata ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin!
    .from(CRM_PAYMENTS_TABLE)
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Zahlung anlegen fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmPaymentRow(data as CrmPaymentRow);
}

export async function updateCrmPayment(
  id: string,
  input: UpdateCrmPaymentInput
): Promise<CrmPayment> {
  assertSupabaseReady();

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status !== undefined) payload.status = input.status;
  if (input.paymentMethod !== undefined) payload.payment_method = input.paymentMethod;
  if (input.stripeCheckoutSessionId !== undefined) {
    payload.stripe_checkout_session_id = input.stripeCheckoutSessionId;
  }
  if (input.stripePaymentIntentId !== undefined) {
    payload.stripe_payment_intent_id = input.stripePaymentIntentId;
  }
  if (input.stripeCustomerId !== undefined) {
    payload.stripe_customer_id = input.stripeCustomerId;
  }
  if (input.metadata !== undefined) payload.metadata = input.metadata;

  const { data, error } = await supabaseAdmin!
    .from(CRM_PAYMENTS_TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Zahlung aktualisieren fehlgeschlagen: ${error?.message}`);
  }

  return mapCrmPaymentRow(data as CrmPaymentRow);
}

export async function getCrmPaymentById(id: string): Promise<CrmPayment | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmPaymentRow(data as CrmPaymentRow);
}

export async function getCrmPaymentByStripeSessionId(
  sessionId: string
): Promise<CrmPayment | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmPaymentRow(data as CrmPaymentRow);
}

export async function listCrmPaymentsByLeadId(
  leadId: string
): Promise<CrmPayment[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as CrmPaymentRow[]).map(mapCrmPaymentRow);
}

export async function getLatestCrmPaymentByQuoteId(
  quoteId: string
): Promise<CrmPayment | null> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapCrmPaymentRow(data as CrmPaymentRow);
}

export async function listAllCrmPayments(limit = 100): Promise<CrmPayment[]> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from(CRM_PAYMENTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as CrmPaymentRow[]).map(mapCrmPaymentRow);
}

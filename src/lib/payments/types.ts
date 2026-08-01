/**
 * Zahlungen – Typen
 */

import type {
  CRM_PAYMENT_REFERENCE_TYPES,
  CRM_PAYMENT_STATUSES,
} from "./constants";

export type CrmPaymentStatus = (typeof CRM_PAYMENT_STATUSES)[number];

export type CrmPaymentReferenceType =
  (typeof CRM_PAYMENT_REFERENCE_TYPES)[number];

export type CrmPaymentMethod =
  | "card"
  | "paypal"
  | "klarna"
  | "apple_pay"
  | "google_pay";

export interface CrmPayment {
  id: string;
  leadId: string | null;
  quoteId: string | null;
  invoiceId: string | null;
  referenceType: CrmPaymentReferenceType;
  referenceId: string | null;
  amountCents: number;
  currency: string;
  status: CrmPaymentStatus;
  paymentMethod: CrmPaymentMethod | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CrmPaymentRow {
  id: string;
  lead_id: string | null;
  quote_id: string | null;
  invoice_id: string | null;
  reference_type: string;
  reference_id: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  payment_method: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCrmPaymentInput {
  leadId?: string | null;
  quoteId?: string | null;
  invoiceId?: string | null;
  referenceType: CrmPaymentReferenceType;
  referenceId?: string | null;
  amountCents: number;
  currency?: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
}

export interface UpdateCrmPaymentInput {
  status?: CrmPaymentStatus;
  paymentMethod?: CrmPaymentMethod | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeCustomerId?: string | null;
  metadata?: Record<string, unknown>;
}

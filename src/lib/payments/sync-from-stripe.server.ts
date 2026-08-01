import "server-only";

import type Stripe from "stripe";
import { isSupabaseConfigured } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { updateCrmLeadStatus } from "@/lib/crm/repository.server";
import { updateCrmQuoteStatus } from "@/lib/crm/quotes/update-status.server";
import { resolveStripePaymentMethod } from "./map-payment-method.server";
import {
  getCrmPaymentById,
  getCrmPaymentByStripeSessionId,
  updateCrmPayment,
} from "./repository.server";
import type { CrmPaymentStatus } from "./types";

async function syncPaymentRecord(
  session: Stripe.Checkout.Session,
  status: CrmPaymentStatus
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const payment =
    (await getCrmPaymentByStripeSessionId(session.id)) ??
    (session.metadata?.paymentId
      ? await getCrmPaymentById(session.metadata.paymentId)
      : null);

  if (!payment) return;

  const paymentMethod =
    stripe && status === "succeeded"
      ? await resolveStripePaymentMethod(stripe, session)
      : null;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  await updateCrmPayment(payment.id, {
    status,
    paymentMethod,
    stripePaymentIntentId: paymentIntentId,
    stripeCustomerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null,
  });

  if (status === "succeeded") {
    if (payment.leadId) {
      await updateCrmLeadStatus(payment.leadId, "kunde");
    }
    if (payment.quoteId) {
      await updateCrmQuoteStatus(payment.quoteId, "accepted");
    }
  }
}

export async function handleStripeCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.payment_status === "paid" || session.status === "complete") {
    await syncPaymentRecord(session, "succeeded");
    return;
  }

  await syncPaymentRecord(session, "processing");
}

export async function handleStripeCheckoutSessionExpired(
  session: Stripe.Checkout.Session
): Promise<void> {
  await syncPaymentRecord(session, "cancelled");
}

export async function handleStripePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const paymentId = paymentIntent.metadata?.paymentId;
  if (!paymentId) return;

  const payment = await getCrmPaymentById(paymentId);
  if (!payment) return;

  await updateCrmPayment(payment.id, {
    status: "failed",
    stripePaymentIntentId: paymentIntent.id,
  });
}

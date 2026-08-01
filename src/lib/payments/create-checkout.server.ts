import "server-only";

import { env, isStripeConfigured, isSupabaseConfigured } from "@/lib/env";
import { isStripePricingConfigured } from "@/lib/env";
import { defaultLocale, locales, type Locale } from "@/i18n/locale-config";
import { STRIPE_PAYMENT_METHOD_TYPES, STRIPE_PRICES, stripe } from "@/lib/stripe";
import { PRICING_AMOUNTS } from "@/lib/i18n/pricing-data";
import {
  createCrmPayment,
  updateCrmPayment,
} from "./repository.server";
import type { CrmPayment } from "./types";

export type PricingPlanId = keyof typeof STRIPE_PRICES;

export interface CheckoutSuccess {
  url: string;
  payment?: CrmPayment;
}

export interface CheckoutFallback {
  fallback: true;
  message: string;
}

function eurosToCents(amount: number): number {
  return Math.round(amount * 100);
}

function buildStripeMetadata(payment: CrmPayment): Record<string, string> {
  const metadata: Record<string, string> = {
    paymentId: payment.id,
    referenceType: payment.referenceType,
  };

  if (payment.referenceId) metadata.referenceId = payment.referenceId;
  if (payment.leadId) metadata.leadId = payment.leadId;
  if (payment.quoteId) metadata.quoteId = payment.quoteId;
  if (payment.invoiceId) metadata.invoiceId = payment.invoiceId;

  return metadata;
}

function buildCheckoutUrls(locale?: string): { successUrl: string; cancelUrl: string } {
  const resolvedLocale =
    locale && locales.includes(locale as Locale) ? locale : defaultLocale;
  const prefix = `/${resolvedLocale}`;

  return {
    successUrl: `${env.siteUrl}${prefix}?payment=success`,
    cancelUrl: `${env.siteUrl}${prefix}#preise`,
  };
}

export async function createPlanPaymentCheckout(input: {
  planId: PricingPlanId;
  email?: string;
  locale?: string;
  leadId?: string;
}): Promise<CheckoutSuccess | CheckoutFallback> {
  if (!isStripeConfigured() || !stripe) {
    return {
      fallback: true,
      message: "Stripe ist nicht konfiguriert – Weiterleitung zum Kontaktformular.",
    };
  }

  if (!isStripePricingConfigured()) {
    return {
      fallback: true,
      message: "Stripe-Preise sind nicht konfiguriert.",
    };
  }

  const priceId = STRIPE_PRICES[input.planId];
  if (!priceId) {
    return { fallback: true, message: "Ungültiger Tarif." };
  }

  const amountCents = eurosToCents(PRICING_AMOUNTS[input.planId]);
  let payment: CrmPayment | null = null;

  if (isSupabaseConfigured()) {
    payment = await createCrmPayment({
      leadId: input.leadId ?? null,
      referenceType: "plan",
      referenceId: input.planId,
      amountCents,
      currency: "EUR",
      description: `AVYZOR ${input.planId} Paket`,
      metadata: { planId: input.planId },
    });
  }

  const { successUrl, cancelUrl } = buildCheckoutUrls(input.locale);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: STRIPE_PAYMENT_METHOD_TYPES,
    line_items: [{ price: priceId, quantity: 1 }],
    ...(input.email ? { customer_email: input.email } : {}),
    metadata: payment ? buildStripeMetadata(payment) : { planId: input.planId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (payment && session.id) {
    payment = await updateCrmPayment(payment.id, {
      stripeCheckoutSessionId: session.id,
      status: "processing",
    });
  }

  if (!session.url) {
    throw new Error("Stripe Checkout URL fehlt.");
  }

  return { url: session.url, payment: payment ?? undefined };
}

export async function createQuotePaymentCheckout(input: {
  leadId: string;
  quoteId: string;
  quoteNumber: string;
  email: string;
  amountCents: number;
  currency: string;
  description: string;
}): Promise<CheckoutSuccess | CheckoutFallback> {
  if (!isStripeConfigured() || !stripe) {
    return {
      fallback: true,
      message: "Stripe ist nicht konfiguriert.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      fallback: true,
      message: "Supabase ist nicht konfiguriert.",
    };
  }

  const payment = await createCrmPayment({
    leadId: input.leadId,
    quoteId: input.quoteId,
    referenceType: "quote",
    referenceId: input.quoteId,
    amountCents: input.amountCents,
    currency: input.currency,
    description: input.description,
    metadata: { quoteNumber: input.quoteNumber },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: STRIPE_PAYMENT_METHOD_TYPES,
    line_items: [
      {
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: input.amountCents,
          product_data: {
            name: input.description,
            description: `Angebot ${input.quoteNumber}`,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: input.email,
    metadata: buildStripeMetadata(payment),
    success_url: `${env.siteUrl}/portal/offers?payment=success`,
    cancel_url: `${env.siteUrl}/portal/offers?payment=cancelled`,
  });

  const updatedPayment = await updateCrmPayment(payment.id, {
    stripeCheckoutSessionId: session.id,
    status: "processing",
  });

  if (!session.url) {
    throw new Error("Stripe Checkout URL fehlt.");
  }

  return { url: session.url, payment: updatedPayment };
}

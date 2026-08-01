import Stripe from "stripe";
import { env, isStripeConfigured } from "@/lib/env";
import { STRIPE_CHECKOUT_PAYMENT_METHOD_TYPES } from "@/lib/payments/constants";

export const stripe = isStripeConfigured()
  ? new Stripe(env.stripe.secretKey, { apiVersion: "2025-02-24.acacia" })
  : null;

export const STRIPE_PRICES = {
  starter: env.stripe.priceStarter,
  professional: env.stripe.priceProfessional,
  enterprise: env.stripe.priceEnterprise,
} as const;

/**
 * Stripe Checkout Zahlungsarten.
 * Apple Pay und Google Pay werden über card-Wallets automatisch angeboten.
 */
export const STRIPE_PAYMENT_METHOD_TYPES = [
  ...STRIPE_CHECKOUT_PAYMENT_METHOD_TYPES,
] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[];

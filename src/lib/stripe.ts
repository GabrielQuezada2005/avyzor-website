import Stripe from "stripe";
import { env, isStripeConfigured } from "@/lib/env";

export const stripe = isStripeConfigured()
  ? new Stripe(env.stripe.secretKey, { apiVersion: "2025-02-24.acacia" })
  : null;

export const STRIPE_PRICES = {
  starter: env.stripe.priceStarter,
  professional: env.stripe.priceProfessional,
  enterprise: env.stripe.priceEnterprise,
} as const;

export async function createCheckoutSession(
  priceId: string,
  customerEmail: string,
  metadata?: Record<string, string>
) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    metadata,
    success_url: `${env.siteUrl}/?payment=success`,
    cancel_url: `${env.siteUrl}/#preise`,
  });
}

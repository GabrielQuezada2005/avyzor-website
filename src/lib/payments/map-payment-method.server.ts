import type Stripe from "stripe";
import type { CrmPaymentMethod } from "./types";

export function mapStripeWalletType(
  walletType: Stripe.PaymentMethod.Card.Wallet.Type | null | undefined
): "apple_pay" | "google_pay" | null {
  if (walletType === "apple_pay") return "apple_pay";
  if (walletType === "google_pay") return "google_pay";
  return null;
}

export async function resolveStripePaymentMethod(
  stripeClient: Stripe,
  session: Stripe.Checkout.Session
): Promise<CrmPaymentMethod | null> {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    const types = session.payment_method_types ?? [];
    if (types.includes("paypal")) return "paypal";
    if (types.includes("klarna")) return "klarna";
    if (types.includes("card")) return "card";
    return null;
  }

  const paymentIntent = await stripeClient.paymentIntents.retrieve(
    paymentIntentId,
    { expand: ["payment_method"] }
  );

  const paymentMethod = paymentIntent.payment_method;
  if (!paymentMethod || typeof paymentMethod === "string") {
    return null;
  }

  if (paymentMethod.type === "paypal") return "paypal";
  if (paymentMethod.type === "klarna") return "klarna";

  if (paymentMethod.type === "card") {
    const wallet = mapStripeWalletType(paymentMethod.card?.wallet?.type);
    if (wallet) return wallet;
    return "card";
  }

  return null;
}

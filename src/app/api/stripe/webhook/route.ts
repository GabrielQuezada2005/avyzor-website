import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";
import { getStripeWebhookSecret, isStripeWebhookConfigured } from "@/lib/env.server";
import { stripe } from "@/lib/stripe";
import {
  handleStripeCheckoutSessionCompleted,
  handleStripeCheckoutSessionExpired,
  handleStripePaymentIntentFailed,
} from "@/lib/payments/sync-from-stripe.server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { success: false, error: "Stripe ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  if (!isStripeWebhookConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Stripe-Webhook ist nicht konfiguriert (STRIPE_WEBHOOK_SECRET).",
      },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Stripe-Signatur fehlt." },
      { status: 400 }
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret()
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error);
    return NextResponse.json(
      { success: false, error: "Ungültige Stripe-Signatur." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleStripeCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "checkout.session.expired":
        await handleStripeCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "payment_intent.payment_failed":
        await handleStripePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook-Verarbeitung fehlgeschlagen." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, received: true });
}

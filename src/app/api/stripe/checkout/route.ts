import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, STRIPE_PRICES, stripe } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/env";
import { stripeCheckoutSchema } from "@/lib/validations";
import { checkRateLimit, rateLimitResponse } from "@/lib/api/security";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  try {
    const body = await request.json();
    const result = stripeCheckoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    const { planId, email } = result.data;
    const priceId = STRIPE_PRICES[planId];

    if (!isStripeConfigured() || !stripe || !priceId) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: "Stripe not configured – redirecting to contact form",
      });
    }

    const session = await createCheckoutSession(
      priceId,
      email ?? "kontakt@avyzor.de",
      { planId }
    );

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, fallback: true },
      { status: 500 }
    );
  }
}

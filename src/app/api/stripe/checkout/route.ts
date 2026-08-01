import { NextRequest, NextResponse } from "next/server";
import { createPlanPaymentCheckout } from "@/lib/payments/create-checkout.server";
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

    const { planId, email, locale } = result.data;
    const checkout = await createPlanPaymentCheckout({ planId, email, locale });

    if ("fallback" in checkout) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: checkout.message,
      });
    }

    return NextResponse.json({
      success: true,
      url: checkout.url,
      paymentId: checkout.payment?.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, fallback: true },
      { status: 500 }
    );
  }
}

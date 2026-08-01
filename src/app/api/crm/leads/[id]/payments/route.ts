import { NextRequest, NextResponse } from "next/server";
import {
  crmAdminUnauthorizedResponse,
  validateCrmAdminRequest,
} from "@/lib/crm/auth.server";
import { getCrmLeadById } from "@/lib/crm/repository.server";
import { getCrmQuoteByLeadId } from "@/lib/crm/quotes/repository.server";
import { createQuotePaymentCheckout } from "@/lib/payments/create-checkout.server";
import { listCrmPaymentsByLeadId } from "@/lib/payments/repository.server";
import { isStripeConfigured, isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  const lead = await getCrmLeadById(params.id);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead nicht gefunden." },
      { status: 404 }
    );
  }

  const payments = await listCrmPaymentsByLeadId(params.id);
  return NextResponse.json({ success: true, payments });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!validateCrmAdminRequest(request)) {
    return crmAdminUnauthorizedResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Supabase ist nicht konfiguriert." },
      { status: 503 }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: "Stripe ist nicht konfiguriert – keine Zahlungslinks möglich.",
      },
      { status: 503 }
    );
  }

  const lead = await getCrmLeadById(params.id);
  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead nicht gefunden." },
      { status: 404 }
    );
  }

  if (!lead.email?.trim()) {
    return NextResponse.json(
      { success: false, error: "Lead hat keine E-Mail-Adresse." },
      { status: 400 }
    );
  }

  const quote = await getCrmQuoteByLeadId(params.id);
  if (!quote) {
    return NextResponse.json(
      {
        success: false,
        error: "Für diesen Lead liegt noch kein Angebot vor.",
        code: "QUOTE_NOT_FOUND",
      },
      { status: 404 }
    );
  }

  const amountCents = Math.round(quote.draft.priceAmount * 100);
  if (amountCents <= 0) {
    return NextResponse.json(
      { success: false, error: "Angebotspreis ist ungültig." },
      { status: 400 }
    );
  }

  const checkout = await createQuotePaymentCheckout({
    leadId: lead.id,
    quoteId: quote.id,
    quoteNumber: quote.quoteNumber,
    email: lead.email.trim(),
    amountCents,
    currency: quote.draft.priceCurrency,
    description: quote.draft.serviceTitle,
  });

  if ("fallback" in checkout) {
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: checkout.message,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    success: true,
    url: checkout.url,
    payment: checkout.payment,
  });
}

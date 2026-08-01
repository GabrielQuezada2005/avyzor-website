import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import {
  sendEmail,
  newsletterConfirmationEmail,
  adminNotificationEmail,
  EMAIL_TO,
} from "@/lib/resend";
import { newsletterSchema } from "@/lib/validations";
import { env } from "@/lib/env";
import { resolveNewsletterLocale } from "@/lib/i18n/newsletter-urls";
import {
  assertFormBackendReady,
  assertEmailBackendReady,
  handleApiError,
  validationErrorResponse,
  zodErrorsToRecord,
  deliverEmails,
} from "@/lib/api/form-handler";
import { PersistenceError } from "@/lib/api/errors";
import {
  checkRateLimit,
  isHoneypotTriggered,
  rateLimitResponse,
} from "@/lib/api/security";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  try {
    const body = await request.json();

    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ success: true });
    }

    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(zodErrorsToRecord(result.error.errors));
    }

    const { email, locale: requestLocale } = result.data;
    assertEmailBackendReady();

    const token = randomUUID();
    const locale = resolveNewsletterLocale(requestLocale);
    const confirmUrl = `${env.siteUrl}/api/newsletter/confirm?token=${token}&locale=${locale}`;

    if (!supabaseAdmin) {
      throw new PersistenceError();
    }

    const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert(
      {
        email,
        confirmation_token: token,
        active: false,
        confirmed_at: null,
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Supabase newsletter error:", error.message);
      throw new PersistenceError();
    }

    await deliverEmails([
      {
        to: email,
        subject: "Newsletter-Anmeldung bestätigen – AVYZOR",
        html: newsletterConfirmationEmail(confirmUrl),
      },
      {
        to: EMAIL_TO,
        subject: "Neue Newsletter-Anmeldung (ausstehend)",
        html: adminNotificationEmail("Newsletter-Anmeldung (Double-Opt-In)", {
          Email: email,
          Status: "Bestätigung ausstehend",
        }),
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "confirmation_sent",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

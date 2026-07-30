import { NextRequest, NextResponse } from "next/server";
import {
  contactConfirmationEmail,
  adminNotificationEmail,
  EMAIL_TO,
} from "@/lib/resend";
import { contactSchema } from "@/lib/validations";
import {
  handleFormSubmission,
  handleApiError,
  validationErrorResponse,
  zodErrorsToRecord,
} from "@/lib/api/form-handler";
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

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(zodErrorsToRecord(result.error.errors));
    }

    const data = result.data;

    await handleFormSubmission({
      persist: {
        table: "leads",
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          message: data.message,
          service: data.service || null,
          source: "contact",
        },
      },
      emails: [
        {
          to: data.email,
          subject: "Ihre Nachricht bei AVYZOR – Bestätigung",
          html: contactConfirmationEmail(data.name),
        },
        {
          to: EMAIL_TO,
          subject: `Neue Kontaktanfrage von ${data.name}`,
          html: adminNotificationEmail("Kontaktanfrage", {
            Name: data.name,
            Email: data.email,
            Telefon: data.phone || "–",
            Unternehmen: data.company || "–",
            Leistung: data.service || "–",
            Nachricht: data.message,
          }),
          replyTo: data.email,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

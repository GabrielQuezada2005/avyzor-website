import { NextRequest, NextResponse } from "next/server";
import {
  contactConfirmationEmail,
  adminNotificationEmail,
  EMAIL_TO,
} from "@/lib/resend";
import { quoteSchema } from "@/lib/validations";
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

    const result = quoteSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(zodErrorsToRecord(result.error.errors));
    }

    const data = result.data;

    await handleFormSubmission({
      persist: {
        table: "quote_requests",
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          service: data.service,
          budget: data.budget || null,
          timeline: data.timeline || null,
          description: data.description || null,
        },
      },
      emails: [
        {
          to: data.email,
          subject: "Ihre Angebotsanfrage bei AVYZOR",
          html: contactConfirmationEmail(data.name),
        },
        {
          to: EMAIL_TO,
          subject: `Neue Angebotsanfrage von ${data.name}`,
          html: adminNotificationEmail("Angebotsanfrage", {
            Name: data.name,
            Email: data.email,
            Leistung: data.service,
            Budget: data.budget || "–",
            Zeitrahmen: data.timeline || "–",
            Beschreibung: data.description || "–",
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

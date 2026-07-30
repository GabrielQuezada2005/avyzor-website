import { NextRequest, NextResponse } from "next/server";
import {
  contactConfirmationEmail,
  adminNotificationEmail,
  EMAIL_TO,
} from "@/lib/resend";
import { bookingSchema } from "@/lib/validations";
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

    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(zodErrorsToRecord(result.error.errors));
    }

    const data = result.data;

    await handleFormSubmission({
      persist: {
        table: "bookings",
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          date: data.date,
          time: data.time,
          service: data.service || null,
          notes: data.notes || null,
        },
      },
      emails: [
        {
          to: data.email,
          subject: "Terminbestätigung – AVYZOR",
          html: contactConfirmationEmail(data.name),
        },
        {
          to: EMAIL_TO,
          subject: `Neue Terminbuchung: ${data.name}`,
          html: adminNotificationEmail("Terminbuchung", {
            Name: data.name,
            Email: data.email,
            Datum: data.date,
            Uhrzeit: data.time,
            Leistung: data.service || "–",
            Anmerkungen: data.notes || "–",
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

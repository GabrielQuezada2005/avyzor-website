import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { createWebsiteBooking } from "@/lib/booking/create-booking.server";
import { isValidBookingDate, isSlotAvailable } from "@/lib/booking";
import { getBookedTimesForDate } from "@/lib/booking/repository.server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  validationErrorResponse,
  zodErrorsToRecord,
} from "@/lib/api/form-handler";
import {
  checkRateLimit,
  isHoneypotTriggered,
  rateLimitResponse,
} from "@/lib/api/security";

export const runtime = "nodejs";

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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Terminbuchung ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie uns direkt.",
          code: "NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const data = result.data;

    if (!isValidBookingDate(data.date)) {
      return NextResponse.json(
        { success: false, error: "Das gewählte Datum ist nicht buchbar." },
        { status: 400 }
      );
    }

    const bookedTimes = await getBookedTimesForDate(data.date);
    if (!isSlotAvailable(data.date, data.time, bookedTimes)) {
      return NextResponse.json(
        {
          success: false,
          error: "Der gewählte Termin ist nicht mehr verfügbar.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    const booking = await createWebsiteBooking({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      service: data.service ?? null,
      notes: data.notes ?? null,
      date: data.date,
      time: data.time,
    });

    return NextResponse.json({
      success: true,
      appointmentId: booking.appointment.id,
      emailSent: booking.emailSent,
      message: booking.emailMessage,
    });
  } catch (error) {
    console.error("[booking] Buchung fehlgeschlagen:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terminbuchung fehlgeschlagen.",
      },
      { status: 500 }
    );
  }
}

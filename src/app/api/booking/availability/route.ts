import { NextRequest, NextResponse } from "next/server";
import {
  getAvailableSlots,
  getBookingDateBounds,
  isValidBookingDate,
  BOOKING_TIMEZONE,
} from "@/lib/booking";
import { getBookedTimesForDate } from "@/lib/booking/repository.server";
import { checkRateLimit, rateLimitResponse } from "@/lib/api/security";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return rateLimitResponse();
  }

  const date = request.nextUrl.searchParams.get("date");

  if (!date) {
    const bounds = getBookingDateBounds();
    return NextResponse.json({
      success: true,
      bounds,
      timezone: BOOKING_TIMEZONE,
    });
  }

  if (!isValidBookingDate(date)) {
    return NextResponse.json({
      success: true,
      date,
      slots: [],
      message: "Datum nicht buchbar.",
    });
  }

  try {
    const bookedTimes = await getBookedTimesForDate(date);
    const slots = getAvailableSlots(date, bookedTimes);

    return NextResponse.json({
      success: true,
      date,
      slots,
      timezone: BOOKING_TIMEZONE,
    });
  } catch (error) {
    console.error("[booking] Verfügbarkeit laden fehlgeschlagen:", error);
    return NextResponse.json(
      {
        success: false,
        date,
        slots: [],
        fallback: true,
        message: "Verfügbarkeit vorübergehend nicht abrufbar.",
      },
      { status: 503 }
    );
  }
}

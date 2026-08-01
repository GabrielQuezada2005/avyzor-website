import "server-only";

import { isResendConfigured } from "@/lib/env";
import {
  adminNotificationEmail,
  sendEmail,
  EMAIL_TO,
} from "@/lib/resend";
import {
  BOOKING_CALENDAR_PROVIDER,
} from "./config";
import { resolveCalendarProvider } from "./calendar/providers";
import {
  buildBookingConfirmationEmail,
  buildBookingConfirmationPlaceholders,
} from "./confirmation-email";
import { isSlotAvailable } from "./availability";
import {
  createAppointment,
  getBookedTimesForDate,
} from "./repository.server";
import { syncBookingToCrmLead } from "./sync-lead.server";
import type { CreateAppointmentInput, CreateBookingResult } from "./types";

export async function createWebsiteBooking(
  input: CreateAppointmentInput
): Promise<CreateBookingResult> {
  const bookedTimes = await getBookedTimesForDate(input.date);

  if (!isSlotAvailable(input.date, input.time, bookedTimes)) {
    throw new Error("Der gewählte Termin ist nicht mehr verfügbar.");
  }

  const lead = await syncBookingToCrmLead(input);

  const calendarProvider = resolveCalendarProvider(BOOKING_CALENDAR_PROVIDER);

  const appointment = await createAppointment(
    input,
    lead?.id ?? null,
    BOOKING_CALENDAR_PROVIDER,
    null
  );

  const calendarSync = await calendarProvider.createEvent({
    appointment,
    summary: `Beratung: ${input.name}`,
    description: [
      input.service ? `Leistung: ${input.service}` : null,
      input.notes ? `Notizen: ${input.notes}` : null,
      `E-Mail: ${input.email}`,
      input.phone ? `Telefon: ${input.phone}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  const placeholders = buildBookingConfirmationPlaceholders({
    name: input.name,
    service: input.service,
    date: input.date,
    time: input.time,
  });

  const confirmation = buildBookingConfirmationEmail(placeholders);

  let emailSent = false;
  let emailMessage = "Bestätigungs-E-Mail vorbereitet, aber nicht versendet.";

  if (isResendConfigured()) {
    const customerResult = await sendEmail({
      to: input.email,
      subject: confirmation.subject,
      html: confirmation.html,
    });

    await sendEmail({
      to: EMAIL_TO,
      subject: `Neue Terminbuchung: ${input.name}`,
      html: adminNotificationEmail("Terminbuchung", {
        Name: input.name,
        Email: input.email,
        Datum: placeholders.Datum,
        Uhrzeit: `${input.time} Uhr`,
        Leistung: placeholders.Dienstleistung,
        Anmerkungen: input.notes ?? "–",
      }),
      replyTo: input.email,
    });

    emailSent = customerResult.success;
    emailMessage = customerResult.success
      ? "Bestätigungs-E-Mail versendet."
      : customerResult.error ?? "E-Mail-Versand fehlgeschlagen.";
  } else {
    emailMessage =
      "Bestätigungs-E-Mail vorbereitet (Resend nicht konfiguriert – kein Versand).";
    console.info("[booking] Confirmation prepared for:", input.email);
  }

  console.info(
    `[booking] Termin erstellt id=${appointment.id} lead=${lead?.id ?? "none"} date=${input.date} time=${input.time}`
  );

  return {
    appointment,
    leadId: lead?.id ?? null,
    emailSent,
    emailMessage,
    calendarSync,
  };
}

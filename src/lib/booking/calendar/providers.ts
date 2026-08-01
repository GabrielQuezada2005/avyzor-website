/**
 * Terminbuchung – Kalender-Provider-Schnittstelle
 *
 * Vorbereitet für Google Calendar und Microsoft Outlook.
 * Aktuell nur interner No-Op-Provider aktiv.
 */

import type {
  CalendarEventInput,
  CalendarProviderId,
  CalendarSyncResult,
} from "../types";

export interface CalendarProvider {
  id: CalendarProviderId;
  createEvent(input: CalendarEventInput): Promise<CalendarSyncResult>;
  updateEvent(input: CalendarEventInput): Promise<CalendarSyncResult>;
  cancelEvent(externalEventId: string): Promise<CalendarSyncResult>;
}

/** Interner Provider – speichert Termine nur in der DB, kein externer Sync. */
export class InternalCalendarProvider implements CalendarProvider {
  id: CalendarProviderId = "internal";

  async createEvent(input: CalendarEventInput): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: true,
      message: "Termin intern gespeichert (kein externer Kalender aktiv).",
    };
  }

  async updateEvent(input: CalendarEventInput): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: input.appointment.externalEventId,
      synced: true,
      message: "Termin intern aktualisiert.",
    };
  }

  async cancelEvent(_externalEventId: string): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: true,
      message: "Termin intern storniert.",
    };
  }
}

/**
 * Platzhalter für Google Calendar – noch nicht implementiert.
 * Später: OAuth + Google Calendar API Events.insert
 */
export class GoogleCalendarProvider implements CalendarProvider {
  id: CalendarProviderId = "google";

  async createEvent(_input: CalendarEventInput): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: false,
      message: "Google Calendar ist noch nicht konfiguriert.",
    };
  }

  async updateEvent(_input: CalendarEventInput): Promise<CalendarSyncResult> {
    return this.createEvent(_input);
  }

  async cancelEvent(): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: false,
      message: "Google Calendar ist noch nicht konfiguriert.",
    };
  }
}

/**
 * Platzhalter für Microsoft Outlook – noch nicht implementiert.
 * Später: Microsoft Graph API /me/events
 */
export class OutlookCalendarProvider implements CalendarProvider {
  id: CalendarProviderId = "outlook";

  async createEvent(_input: CalendarEventInput): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: false,
      message: "Microsoft Outlook ist noch nicht konfiguriert.",
    };
  }

  async updateEvent(_input: CalendarEventInput): Promise<CalendarSyncResult> {
    return this.createEvent(_input);
  }

  async cancelEvent(): Promise<CalendarSyncResult> {
    return {
      provider: this.id,
      externalEventId: null,
      synced: false,
      message: "Microsoft Outlook ist noch nicht konfiguriert.",
    };
  }
}

export function resolveCalendarProvider(
  providerId: CalendarProviderId
): CalendarProvider {
  switch (providerId) {
    case "google":
      return new GoogleCalendarProvider();
    case "outlook":
      return new OutlookCalendarProvider();
    case "internal":
    default:
      return new InternalCalendarProvider();
  }
}

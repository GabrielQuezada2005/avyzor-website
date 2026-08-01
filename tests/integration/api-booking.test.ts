import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as bookingPost } from "@/app/api/booking/route";
import { createMockRequest, parseJsonResponse } from "../helpers/next-request";
import { getFutureBookableDate } from "../helpers/booking-dates";

vi.mock("@/lib/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/env")>();
  return {
    ...actual,
    isSupabaseConfigured: vi.fn(() => false),
  };
});

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ungültige Buchungsdaten ab", async () => {
    const request = createMockRequest({
      body: {
        name: "A",
        email: "ungueltig",
        date: "",
        time: "",
        consent: true,
        website: "",
      },
      ip: "192.0.2.20",
    });

    const response = await bookingPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; errors?: Record<string, string> }>(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("meldet fehlende Backend-Konfiguration", async () => {
    const request = createMockRequest({
      body: {
        name: "Anna Beispiel",
        email: "anna@example.com",
        date: getFutureBookableDate(),
        time: "10:00",
        consent: true,
        website: "",
      },
      ip: "192.0.2.21",
    });

    const response = await bookingPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; code?: string }>(response);

    expect(status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.code).toBe("NOT_CONFIGURED");
  });

  it("ignoriert Honeypot-Spam still", async () => {
    const request = createMockRequest({
      body: {
        name: "Bot",
        email: "bot@spam.com",
        date: getFutureBookableDate(),
        time: "10:00",
        consent: true,
        website: "spam",
      },
      ip: "192.0.2.22",
    });

    const response = await bookingPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean }>(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });
});

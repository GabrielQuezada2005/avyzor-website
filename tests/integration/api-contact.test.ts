import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as contactPost } from "@/app/api/contact/route";
import { createMockRequest, parseJsonResponse } from "../helpers/next-request";

vi.mock("@/lib/api/form-handler", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/form-handler")>();
  return {
    ...actual,
    handleFormSubmission: vi.fn(async () => undefined),
  };
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ungültige Formulardaten ab", async () => {
    const request = createMockRequest({
      body: {
        name: "A",
        email: "ungueltig",
        message: "kurz",
        consent: true,
        website: "",
      },
      ip: "192.0.2.1",
    });

    const response = await contactPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; errors?: Record<string, string> }>(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.errors).toBeDefined();
  });

  it("ignoriert Honeypot-Spam still", async () => {
    const request = createMockRequest({
      body: {
        name: "Bot",
        email: "bot@spam.com",
        message: "Spam Nachricht mit genug Text",
        consent: true,
        website: "https://spam.example",
      },
      ip: "192.0.2.2",
    });

    const response = await contactPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean }>(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("verarbeitet gültige Kontaktanfragen", async () => {
    const { handleFormSubmission } = await import("@/lib/api/form-handler");

    const request = createMockRequest({
      body: {
        name: "Max Mustermann",
        email: "max@example.com",
        phone: "+49 170 1234567",
        company: "Beispiel GmbH",
        message: "Ich interessiere mich für eine Premium-Website.",
        service: "Premium-Website",
        consent: true,
        website: "",
      },
      ip: "192.0.2.3",
    });

    const response = await contactPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean }>(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(handleFormSubmission).toHaveBeenCalledOnce();
  });
});

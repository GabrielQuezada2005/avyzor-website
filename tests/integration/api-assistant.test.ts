import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as assistantPost } from "@/app/api/assistant/route";
import { createMockRequest, parseJsonResponse } from "../helpers/next-request";

vi.mock("@/lib/assistant/openai", () => ({
  generateOpenAIResponse: vi.fn(async () => "Gerne helfe ich Ihnen weiter."),
}));

vi.mock("@/lib/crm/sync-lead.server", () => ({
  syncDetectedLeadToCrm: vi.fn(async () => undefined),
}));

describe("POST /api/assistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt leere Nachrichten ab", async () => {
    const request = createMockRequest({
      body: {
        messages: [{ role: "user", content: "   " }],
      },
      ip: "192.0.2.10",
    });

    const response = await assistantPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; errors?: Record<string, string> }>(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("verlangt eine Nutzer-Nachricht als letzte Message", async () => {
    const request = createMockRequest({
      body: {
        messages: [
          { role: "user", content: "Hallo" },
          { role: "assistant", content: "Willkommen!" },
        ],
      },
      ip: "192.0.2.11",
    });

    const response = await assistantPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; code?: string }>(response);

    expect(status).toBe(400);
    expect(body.code).toBe("INVALID_CONVERSATION");
  });

  it("führt Lead-Erkennung bei Session-ID aus", async () => {
    const request = createMockRequest({
      body: {
        sessionId: "integration-session-01",
        locale: "de",
        messages: [
          {
            role: "user",
            content:
              "Ich bin Max Mustermann, max@example.com. Wir brauchen eine Premium-Website.",
          },
        ],
      },
      ip: "192.0.2.12",
    });

    const response = await assistantPost(request);
    const { status, body } = await parseJsonResponse<{
      success: boolean;
      message: string;
      lead: { kontakt: { email: string } } | null;
    }>(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("Gerne");
    expect(body.lead?.kontakt.email).toBe("max@example.com");
  });

  it("ignoriert Honeypot-Spam still", async () => {
    const request = createMockRequest({
      body: {
        website: "bot",
        messages: [{ role: "user", content: "Hallo" }],
      },
      ip: "192.0.2.13",
    });

    const response = await assistantPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean }>(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });
});

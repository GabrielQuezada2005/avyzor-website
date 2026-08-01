import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as portalLoginPost } from "@/app/api/portal/auth/login/route";
import { createMockRequest, parseJsonResponse } from "../helpers/next-request";

vi.mock("@/lib/env.server", () => ({
  isPortalAuthConfigured: vi.fn(() => true),
}));

vi.mock("@/lib/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/env")>();
  return {
    ...actual,
    isSupabaseConfigured: vi.fn(() => true),
  };
});

vi.mock("@/lib/portal/repository.server", () => ({
  authenticatePortalUser: vi.fn(async () => null),
}));

vi.mock("@/lib/portal/session.server", () => ({
  setPortalSessionCookie: vi.fn(async () => undefined),
}));

describe("POST /api/portal/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt ungültige Anmeldedaten ab", async () => {
    const request = createMockRequest({
      body: {
        email: "ungueltig",
        password: "",
      },
      ip: "192.0.2.30",
    });

    const response = await portalLoginPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean }>(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("meldet fehlende Portal-Konfiguration", async () => {
    const { isPortalAuthConfigured } = await import("@/lib/env.server");
    vi.mocked(isPortalAuthConfigured).mockReturnValueOnce(false);

    const request = createMockRequest({
      body: {
        email: "user@example.com",
        password: "geheim123",
      },
      ip: "192.0.2.31",
    });

    const response = await portalLoginPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; code?: string }>(response);

    expect(status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.code).toBe("NOT_CONFIGURED");
  });
});

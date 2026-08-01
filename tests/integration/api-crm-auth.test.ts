import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as crmAuthPost } from "@/app/api/crm/auth/route";
import { createMockRequest, parseJsonResponse } from "../helpers/next-request";

vi.mock("@/lib/env.server", () => ({
  isCrmAdminConfigured: vi.fn(() => true),
  getCrmAdminSecret: vi.fn(() => "test-secret"),
}));

describe("POST /api/crm/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lehnt leere Passwörter ab", async () => {
    const request = createMockRequest({
      body: { password: "" },
      ip: "192.0.2.40",
    });

    const response = await crmAuthPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; code?: string }>(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.code).toBe("BAD_REQUEST");
  });

  it("meldet fehlende CRM-Konfiguration", async () => {
    const { isCrmAdminConfigured } = await import("@/lib/env.server");
    vi.mocked(isCrmAdminConfigured).mockReturnValueOnce(false);

    const request = createMockRequest({
      body: { password: "admin-secret" },
      ip: "192.0.2.41",
    });

    const response = await crmAuthPost(request);
    const { status, body } = await parseJsonResponse<{ success: boolean; code?: string }>(response);

    expect(status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.code).toBe("NOT_CONFIGURED");
  });
});

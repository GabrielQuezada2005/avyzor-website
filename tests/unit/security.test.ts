import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  isHoneypotTriggered,
} from "@/lib/api/security";
import { createMockRequest } from "../helpers/next-request";

describe("getClientIp", () => {
  it("liest die erste IP aus x-forwarded-for", () => {
    const request = createMockRequest({
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });

  it("fällt auf x-real-ip zurück", () => {
    const request = createMockRequest({
      omitForwardedFor: true,
      headers: { "x-real-ip": "198.51.100.42" },
    });
    expect(getClientIp(request)).toBe("198.51.100.42");
  });
});

describe("isHoneypotTriggered", () => {
  it("erkennt ausgefüllte Honeypot-Felder", () => {
    expect(isHoneypotTriggered({ website: "bot" })).toBe(true);
    expect(isHoneypotTriggered({ _gotcha: "spam" })).toBe(true);
    expect(isHoneypotTriggered({ url: "http://spam" })).toBe(true);
  });

  it("ignoriert leere Honeypot-Felder", () => {
    expect(isHoneypotTriggered({ website: "" })).toBe(false);
    expect(isHoneypotTriggered({ name: "Max" })).toBe(false);
  });
});

describe("checkRateLimit", () => {
  it("erlaubt Anfragen innerhalb des Limits", () => {
    const request = createMockRequest({ ip: "10.0.0.10" });
    expect(checkRateLimit(request, "strict", "unit-test-a")).toBe(true);
    expect(checkRateLimit(request, "strict", "unit-test-a")).toBe(true);
  });

  it("blockiert Anfragen über dem Limit", () => {
    const request = createMockRequest({ ip: "10.0.0.11" });
    const key = "unit-test-b";

    expect(checkRateLimit(request, "strict", key)).toBe(true);
    expect(checkRateLimit(request, "strict", key)).toBe(true);
    expect(checkRateLimit(request, "strict", key)).toBe(true);
    expect(checkRateLimit(request, "strict", key)).toBe(false);
  });
});

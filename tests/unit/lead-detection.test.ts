import { describe, expect, it } from "vitest";
import {
  calculateProfileCompleteness,
  detectServiceInterestLevel,
  detectServices,
  extractEmail,
  extractLeadProfile,
  extractPhone,
} from "@/lib/assistant/lead-detection/extractor";
import {
  processLeadDetection,
} from "@/lib/assistant/lead-detection";
import type { ScoringMessage } from "@/lib/assistant/lead-scoring/types";

const messages: ScoringMessage[] = [
  {
    role: "user",
    content:
      "Hallo, ich bin Max Mustermann von Beispiel GmbH. Meine E-Mail ist max@example.com und mein Handy +49 170 1234567. Wir brauchen eine Premium-Website und interessieren uns für SEO.",
  },
];

describe("Lead-Extraktion", () => {
  it("extrahiert E-Mail-Adressen", () => {
    expect(extractEmail("Kontakt: max@example.com")).toBe("max@example.com");
  });

  it("extrahiert Telefonnummern", () => {
    expect(extractPhone("Telefon: +49 170 1234567")).toBe("+49 170 1234567");
  });

  it("erkennt Dienstleistungen im Text", () => {
    const services = detectServices("Wir brauchen eine Website und SEO.");
    expect(services).toContain("Premium-Website");
    expect(services).toContain("SEO");
  });

  it("klassifiziert Service-Interesse", () => {
    expect(
      detectServiceInterestLevel("Ich möchte gerne ein Angebot anfordern.", [
        "Premium-Website",
      ])
    ).toBe("ready");
    expect(detectServiceInterestLevel("Was kostet das?", [])).toBe("curious");
  });

  it("baut ein vollständiges Lead-Profil", () => {
    const profile = extractLeadProfile(messages);
    expect(profile.email).toBe("max@example.com");
    expect(profile.phone).toBeTruthy();
    expect(profile.desiredService).toContain("Premium-Website");
  });

  it("berechnet Profil-Vollständigkeit", () => {
    const profile = extractLeadProfile(messages);
    expect(calculateProfileCompleteness(profile)).toBeGreaterThan(50);
  });
});

describe("processLeadDetection", () => {
  it("speichert und liefert strukturierte Lead-Daten", () => {
    const record = processLeadDetection("test-session-12345678", messages);

    expect(record.sessionId).toBe("test-session-12345678");
    expect(record.profile.email).toBe("max@example.com");
    expect(record.detectedServices.length).toBeGreaterThan(0);
    expect(record.completenessScore).toBeGreaterThan(0);
    expect(record.hasServiceInterest).toBe(true);
  });
});

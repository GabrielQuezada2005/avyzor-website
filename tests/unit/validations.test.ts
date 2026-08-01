import { describe, expect, it } from "vitest";
import {
  bookingSchema,
  contactSchema,
  crmAuthSchema,
  portalLoginSchema,
  portalRegisterSchema,
} from "@/lib/validations";

const validContact = {
  name: "Max Mustermann",
  email: "max@example.com",
  message: "Ich interessiere mich für eine Website.",
  consent: true as const,
  website: "",
};

describe("contactSchema", () => {
  it("akzeptiert gültige Kontaktdaten", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("lehnt zu kurze Namen ab", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "A" });
    expect(result.success).toBe(false);
  });

  it("lehnt ungültige E-Mail ab", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      email: "keine-email",
    });
    expect(result.success).toBe(false);
  });

  it("lehnt fehlende Einwilligung ab", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("lehnt ausgefülltes Honeypot-Feld ab", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      website: "spam-bot",
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingSchema", () => {
  it("akzeptiert gültige Buchungsdaten", () => {
    const result = bookingSchema.safeParse({
      name: "Anna Beispiel",
      email: "anna@example.com",
      date: "2026-09-15",
      time: "10:00",
      consent: true,
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("verlangt Datum und Uhrzeit", () => {
    const result = bookingSchema.safeParse({
      name: "Anna Beispiel",
      email: "anna@example.com",
      date: "",
      time: "",
      consent: true,
      website: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("portalLoginSchema", () => {
  it("akzeptiert gültige Anmeldedaten", () => {
    const result = portalLoginSchema.safeParse({
      email: "user@example.com",
      password: "geheim123",
    });
    expect(result.success).toBe(true);
  });

  it("lehnt leeres Passwort ab", () => {
    const result = portalLoginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("portalRegisterSchema", () => {
  it("verlangt mindestens 8 Zeichen Passwort", () => {
    const result = portalRegisterSchema.safeParse({
      name: "Max Mustermann",
      email: "max@example.com",
      password: "kurz",
    });
    expect(result.success).toBe(false);
  });
});

describe("crmAuthSchema", () => {
  it("verlangt ein Passwort", () => {
    const result = crmAuthSchema.safeParse({ password: "" });
    expect(result.success).toBe(false);
  });
});

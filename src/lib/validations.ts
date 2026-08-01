import { z } from "zod";
import { localeCodes } from "@/i18n/locale-config";

const honeypotField = z
  .string()
  .max(0, "Spam erkannt")
  .optional()
  .or(z.literal(""));

const consentField = z.literal(true, {
  errorMap: () => ({
    message: "Bitte stimmen Sie der Datenschutzerklärung zu.",
  }),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen haben"),
  service: z.string().optional(),
  consent: consentField,
  website: honeypotField,
});

export const quoteSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Bitte wählen Sie eine Leistung"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().optional(),
  consent: consentField,
  website: honeypotField,
});

export const bookingSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  date: z.string().min(1, "Bitte wählen Sie ein Datum"),
  time: z.string().min(1, "Bitte wählen Sie eine Uhrzeit"),
  service: z.string().optional(),
  notes: z.string().optional(),
  consent: consentField,
  website: honeypotField,
});

export const newsletterSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  consent: consentField,
  website: honeypotField,
  locale: z.enum(localeCodes).optional(),
});

export const stripeCheckoutSchema = z.object({
  planId: z.enum(["starter", "professional", "enterprise"]),
  email: z.string().email().optional(),
  locale: z.enum(localeCodes).optional(),
});

export const crmAuthSchema = z.object({
  password: z.string().min(1, "Passwort erforderlich."),
});

export const portalLoginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse."),
  password: z.string().min(1, "Passwort erforderlich."),
});

export const portalRegisterSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben."),
  email: z.string().email("Ungültige E-Mail-Adresse."),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben."),
  company: z.string().optional(),
});

export const newsletterConfirmSchema = z.object({
  token: z.string().uuid("Ungültiger Bestätigungslink"),
});

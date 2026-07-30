import { z } from "zod";

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
});

export const stripeCheckoutSchema = z.object({
  planId: z.enum(["starter", "professional", "enterprise"]),
  email: z.string().email().optional(),
});

export const newsletterConfirmSchema = z.object({
  token: z.string().uuid("Ungültiger Bestätigungslink"),
});

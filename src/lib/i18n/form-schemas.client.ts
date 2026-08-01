"use client";

import { z } from "zod";

export interface FormValidationMessages {
  nameMin: string;
  emailInvalid: string;
  messageMin: string;
  serviceRequired: string;
  dateRequired: string;
  timeRequired: string;
  consentRequired: string;
}

function honeypotField(message: string) {
  return z
    .string()
    .max(0, message)
    .optional()
    .or(z.literal(""));
}

function consentField(message: string) {
  return z.literal(true, {
    errorMap: () => ({ message }),
  });
}

export function createContactFormSchema(messages: FormValidationMessages) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(10, messages.messageMin),
    service: z.string().optional(),
    consent: consentField(messages.consentRequired),
    website: honeypotField(""),
  });
}

export function createQuoteFormSchema(messages: FormValidationMessages) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string().min(1, messages.serviceRequired),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    description: z.string().optional(),
    consent: consentField(messages.consentRequired),
    website: honeypotField(""),
  });
}

export function createBookingFormSchema(messages: FormValidationMessages) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    phone: z.string().optional(),
    date: z.string().min(1, messages.dateRequired),
    time: z.string().min(1, messages.timeRequired),
    service: z.string().optional(),
    notes: z.string().optional(),
    consent: consentField(messages.consentRequired),
    website: honeypotField(""),
  });
}

export function createNewsletterFormSchema(messages: FormValidationMessages) {
  return z.object({
    email: z.string().email(messages.emailInvalid),
    consent: consentField(messages.consentRequired),
    website: honeypotField(""),
  });
}

export function zodErrorsToFieldRecord(
  issues: Array<{ path: (string | number)[]; message: string }>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (key !== undefined && typeof key === "string") {
      errors[key] = issue.message;
    }
  }
  return errors;
}

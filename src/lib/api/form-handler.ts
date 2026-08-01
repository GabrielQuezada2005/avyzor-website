import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, type SendEmailResult } from "@/lib/resend";
import { isResendConfigured, isSupabaseConfigured } from "@/lib/env";
import {
  ServiceUnavailableError,
  PersistenceError,
  EmailDeliveryError,
} from "@/lib/api/errors";

interface PersistOptions {
  table: string;
  data: Record<string, unknown>;
}

interface FormSubmissionOptions {
  persist: PersistOptions;
  emails: Array<{
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }>;
}

export function assertFormBackendReady(): void {
  if (!isSupabaseConfigured()) {
    throw new ServiceUnavailableError();
  }
}

export function assertEmailBackendReady(): void {
  assertFormBackendReady();
  if (!isResendConfigured()) {
    throw new ServiceUnavailableError();
  }
}

export async function persistRecord({
  table,
  data,
}: PersistOptions): Promise<void> {
  if (!supabaseAdmin) {
    throw new ServiceUnavailableError();
  }

  const { error } = await supabaseAdmin.from(table).insert(data);

  if (error) {
    console.error(`Supabase insert failed (${table}):`, error.message);
    throw new PersistenceError();
  }
}

export async function deliverEmails(
  emails: FormSubmissionOptions["emails"]
): Promise<void> {
  if (!isResendConfigured()) {
    console.info("[forms] Resend nicht konfiguriert – E-Mail-Versand übersprungen");
    return;
  }

  const results: SendEmailResult[] = await Promise.all(
    emails.map((email) => sendEmail(email))
  );

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.error(
      "Email delivery failed:",
      failed.map((r) => r.error).join(", ")
    );
    throw new EmailDeliveryError();
  }
}

export async function handleFormSubmission(
  options: FormSubmissionOptions
): Promise<void> {
  assertFormBackendReady();
  await persistRecord(options.persist);
  await deliverEmails(options.emails);
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ServiceUnavailableError) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Der Dienst ist vorübergehend nicht verfügbar. Bitte kontaktieren Sie uns direkt per E-Mail.",
        code: error.code,
      },
      { status: 503 }
    );
  }

  if (error instanceof PersistenceError) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        code: error.code,
      },
      { status: 500 }
    );
  }

  if (error instanceof EmailDeliveryError) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Ihre Anfrage wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht gesendet werden. Wir melden uns dennoch bei Ihnen.",
        code: error.code,
      },
      { status: 500 }
    );
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." },
    { status: 500 }
  );
}

export function validationErrorResponse(
  errors: Record<string, string>
): NextResponse {
  return NextResponse.json({ success: false, errors }, { status: 400 });
}

export function zodErrorsToRecord(
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

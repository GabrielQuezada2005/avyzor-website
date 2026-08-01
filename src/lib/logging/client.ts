"use client";

/** Client-seitiges Fehler-Logging – vorbereitet für externes Monitoring. */
export function logClientError(
  message: string,
  error?: unknown,
  context: Record<string, unknown> = {}
): void {
  const payload = {
    level: "error" as const,
    message,
    timestamp: new Date().toISOString(),
    digest:
      error instanceof Error && "digest" in error
        ? (error as Error & { digest?: string }).digest
        : undefined,
    ...context,
  };

  console.error(JSON.stringify(payload));
}

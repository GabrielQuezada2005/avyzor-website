/**
 * Next.js Instrumentation – Hook für Monitoring beim Server-Start.
 * Vorbereitet für Sentry, OpenTelemetry o. Ä.
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Beispiel: Sentry.init({ dsn: process.env.SENTRY_DSN });
  }
}

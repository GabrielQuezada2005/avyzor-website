import "server-only";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

function serializeError(error: unknown): Record<string, unknown> | undefined {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
}

/** Strukturiertes Server-Logging – vorbereitet für externes Monitoring (Sentry, Datadog, …). */
export function logEvent(
  level: LogLevel,
  message: string,
  context: LogContext = {}
): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: "avyzor-web",
    environment: process.env.NODE_ENV ?? "development",
    ...context,
  };

  const payload = JSON.stringify(entry);

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  if (level === "debug" && process.env.NODE_ENV !== "production") {
    console.debug(payload);
    return;
  }

  if (level !== "debug") {
    console.info(payload);
  }
}

export function logError(
  message: string,
  error?: unknown,
  context: LogContext = {}
): void {
  logEvent("error", message, {
    ...context,
    error: serializeError(error),
  });
}

export function logWarn(message: string, context: LogContext = {}): void {
  logEvent("warn", message, context);
}

export function logInfo(message: string, context: LogContext = {}): void {
  logEvent("info", message, context);
}

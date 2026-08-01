/**
 * TTS-Debug-Protokollierung – nur für technische Verifikation.
 */

export interface TtsDebugReport {
  ttsProvider: string;
  voiceId: string;
  model: string;
  responseStatus: number | string;
  audioSource: string;
  requestUrl?: string;
  responseHeaders?: Record<string, string>;
  /** server = API-Route, server-upstream = ElevenLabs/OpenAI, client = Browser */
  phase?: string;
}

export function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

export function formatTtsDebugReport(report: TtsDebugReport): string {
  const lines = [
    "========== TTS DEBUG ==========",
    `TTS Provider: ${report.ttsProvider}`,
    `Voice ID: ${report.voiceId}`,
    `Model: ${report.model}`,
    `Response Status: ${report.responseStatus}`,
    `Audio Source: ${report.audioSource}`,
  ];

  if (report.phase) {
    lines.push(`Phase: ${report.phase}`);
  }
  if (report.requestUrl) {
    lines.push(`Request URL: ${report.requestUrl}`);
  }
  if (report.responseHeaders && Object.keys(report.responseHeaders).length > 0) {
    lines.push("Response Headers:");
    for (const [key, value] of Object.entries(report.responseHeaders)) {
      lines.push(`  ${key}: ${value}`);
    }
  }
  lines.push("================================");

  return lines.join("\n");
}

export function logTtsDebugReport(report: TtsDebugReport): void {
  console.log(formatTtsDebugReport(report));
}

/** Client → Dev-Server-Terminal (für Browser-Fallback und Client-Bestätigung). */
export async function reportTtsDebugToServer(report: TtsDebugReport): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/assistant/tts/debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
  } catch {
    // Debug-only – Fehler ignorieren
  }
}

export function logTtsDebugClient(report: TtsDebugReport): void {
  logTtsDebugReport(report);
  void reportTtsDebugToServer(report);
}

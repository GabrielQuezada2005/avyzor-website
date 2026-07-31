/**
 * Voice Mode – OpenAI Speech-to-Text Provider (Vorbereitung)
 *
 * Platzhalter für OpenAI Whisper API.
 * Aktuell nicht aktiv – Engine fällt auf Browser-STT zurück.
 *
 * Integration (später):
 * 1. API-Route: POST /api/assistant/stt
 * 2. MediaRecorder → Audio-Blob senden
 * 3. Whisper transkribiert → Text zurück
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append('file', audioBlob, 'audio.webm');
 * formData.append('language', lang.split('-')[0]);
 * const res = await fetch('/api/assistant/stt', { method: 'POST', body: formData });
 * const { text } = await res.json();
 * options.onFinal(text);
 * ```
 */

import type { SttProvider, SttStartOptions, SttStateListener } from "../types";

export class OpenAiSttProvider implements SttProvider {
  readonly id = "openai" as const;

  private listeners = new Set<SttStateListener>();

  isSupported(): boolean {
    return false;
  }

  subscribe(listener: SttStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start(_options: SttStartOptions): void {
    throw new Error(
      "OpenAI STT ist noch nicht konfiguriert. Nutze Browser-Speech-Recognition."
    );
  }

  stop(): void {
    /* future */
  }

  abort(): void {
    /* future */
  }
}

let openAiInstance: OpenAiSttProvider | null = null;

export function getOpenAiSttProvider(): OpenAiSttProvider {
  if (!openAiInstance) {
    openAiInstance = new OpenAiSttProvider();
  }
  return openAiInstance;
}

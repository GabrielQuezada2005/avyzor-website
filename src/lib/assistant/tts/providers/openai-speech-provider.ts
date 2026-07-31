/**
 * Text-to-Speech – OpenAI TTS Provider (Vorbereitung)
 *
 * Platzhalter für zukünftige Premium-Stimmen über OpenAI Text-to-Speech.
 * Aktuell nicht aktiv – Engine fällt automatisch auf Browser-Speech zurück.
 *
 * Integration (später):
 * 1. API-Route anlegen: POST /api/assistant/tts
 * 2. OpenAI TTS aufrufen (model: tts-1 / tts-1-hd, voice: alloy|nova|…)
 * 3. Audio-Blob zurückgeben
 * 4. Hier per Audio-Element abspielen
 *
 * @example
 * ```ts
 * const res = await fetch('/api/assistant/tts', {
 *   method: 'POST',
 *   body: JSON.stringify({ text, lang }),
 * });
 * const blob = await res.blob();
 * const url = URL.createObjectURL(blob);
 * this.audio.src = url;
 * await this.audio.play();
 * ```
 */

import type {
  SpeakOptions,
  SpeechStateListener,
  TtsProvider,
} from "../types";

export class OpenAiSpeechProvider implements TtsProvider {
  readonly id = "openai" as const;

  private listeners = new Set<SpeechStateListener>();
  private audio: HTMLAudioElement | null = null;
  private currentMessageId: string | null = null;

  /**
   * Aktiv, sobald API-Route und Konfiguration vorhanden sind.
   * Bis dahin: false → Engine nutzt Browser-Fallback.
   */
  isSupported(): boolean {
    return false;
  }

  subscribe(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async speak(_options: SpeakOptions): Promise<void> {
    // Zukünftige Implementierung – siehe Dateikopf
    throw new Error(
      "OpenAI TTS ist noch nicht konfiguriert. Nutze Browser-Speech."
    );
  }

  pause(): void {
    this.audio?.pause();
  }

  resume(): void {
    void this.audio?.play();
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.currentMessageId = null;
  }
}

let openAiInstance: OpenAiSpeechProvider | null = null;

export function getOpenAiSpeechProvider(): OpenAiSpeechProvider {
  if (!openAiInstance) {
    openAiInstance = new OpenAiSpeechProvider();
  }
  return openAiInstance;
}

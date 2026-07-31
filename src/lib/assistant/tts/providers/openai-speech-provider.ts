/**
 * Text-to-Speech – OpenAI TTS Provider
 *
 * Premium-Sprachausgabe über OpenAI Text-to-Speech API.
 * Fallback auf Browser-Speech bei Fehlern – ohne Fehlermeldung für Nutzer.
 */

import { getBrowserSpeechProvider } from "./browser-speech-provider";
import {
  fromOpenAiVoiceUri,
  resolveOpenAiVoice,
  toOpenAiVoiceUri,
} from "../openai-voices";
import { loadTtsPreferences } from "../preferences";
import { sanitizeTextForSpeech } from "../sanitize-for-speech";
import type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsProvider,
} from "../types";

interface TtsStatusResponse {
  available: boolean;
  provider: "openai" | "browser";
}

export class OpenAiSpeechProvider implements TtsProvider {
  readonly id = "openai" as const;

  private listeners = new Set<SpeechStateListener>();
  private audio: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;
  private currentMessageId: string | null = null;
  private playbackState: SpeechPlaybackState = "idle";
  private serverAvailable: boolean | null = null;

  /** Wird nach GET /api/assistant/tts gesetzt. */
  setServerAvailable(available: boolean): void {
    this.serverAvailable = available;
  }

  isSupported(): boolean {
    if (this.serverAvailable !== null) return this.serverAvailable;
    return typeof window !== "undefined";
  }

  subscribe(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((l) =>
      l({
        messageId: this.currentMessageId,
        playbackState: this.playbackState,
      })
    );
  }

  private setState(
    playbackState: SpeechPlaybackState,
    messageId: string | null = this.currentMessageId
  ): void {
    this.playbackState = playbackState;
    this.currentMessageId = messageId;
    this.emit();
  }

  private cleanupAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  async speak(options: SpeakOptions): Promise<void> {
    if (typeof window === "undefined") return;

    this.stop();

    const text = sanitizeTextForSpeech(options.text);
    if (!text) return;

    const prefs = loadTtsPreferences();
    const lang = options.lang ?? "de-DE";
    const voiceUri = options.settings?.voiceUri ?? prefs.voiceUri;
    const voice =
      fromOpenAiVoiceUri(voiceUri) ?? resolveOpenAiVoice(voiceUri, lang);
    const speed = options.settings?.rate ?? prefs.rate;
    const volume = options.settings?.volume ?? prefs.volume;

    this.setState("loading", options.messageId);

    try {
      const response = await fetch("/api/assistant/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang, voice, speed }),
      });

      if (!response.ok) {
        await this.fallbackToBrowser(options);
        return;
      }

      const blob = await response.blob();
      this.objectUrl = URL.createObjectURL(blob);

      const audio = new Audio(this.objectUrl);
      audio.volume = volume;
      this.audio = audio;

      audio.onplay = () => this.setState("playing", options.messageId);
      audio.onended = () => {
        if (this.currentMessageId === options.messageId) {
          this.cleanupAudio();
          this.setState("idle", null);
        }
      };
      audio.onerror = () => {
        if (this.currentMessageId === options.messageId) {
          this.cleanupAudio();
          this.setState("idle", null);
        }
      };

      await audio.play();
    } catch {
      await this.fallbackToBrowser(options);
    }
  }

  private async fallbackToBrowser(options: SpeakOptions): Promise<void> {
    this.cleanupAudio();
    this.setState("idle", null);
    await getBrowserSpeechProvider().speak(options);
  }

  pause(): void {
    if (!this.audio || this.playbackState !== "playing") return;
    this.audio.pause();
    this.setState("paused");
  }

  resume(): void {
    if (!this.audio || this.playbackState !== "paused") return;
    void this.audio.play();
    this.setState("playing");
  }

  stop(): void {
    this.cleanupAudio();
    this.setState("idle", null);
  }
}

let openAiInstance: OpenAiSpeechProvider | null = null;

export function getOpenAiSpeechProvider(): OpenAiSpeechProvider {
  if (!openAiInstance) {
    openAiInstance = new OpenAiSpeechProvider();
  }
  return openAiInstance;
}

/** Prüft Server-Verfügbarkeit und aktiviert OpenAI TTS. */
export async function probeOpenAiTtsAvailability(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/assistant/tts");
    if (!res.ok) return false;

    const data = (await res.json()) as TtsStatusResponse;
    getOpenAiSpeechProvider().setServerAvailable(data.available);
    return data.available;
  } catch {
    getOpenAiSpeechProvider().setServerAvailable(false);
    return false;
  }
}

export { toOpenAiVoiceUri, resolveOpenAiVoice };

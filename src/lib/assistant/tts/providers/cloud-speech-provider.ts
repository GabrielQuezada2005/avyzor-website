/**
 * Text-to-Speech – Cloud Provider (OpenAI & ElevenLabs)
 *
 * Premium-Sprachausgabe über /api/assistant/tts mit Streaming-Wiedergabe.
 * Fallback auf Browser-Speech bei Fehlern – ohne Fehlermeldung für Nutzer.
 */

import { getBrowserSpeechProvider } from "./browser-speech-provider";
import { loadTtsPreferences } from "../preferences";
import { sanitizeTextForSpeech } from "../sanitize-for-speech";
import {
  cleanupStreamAudio,
  playStreamingAudioResponse,
  type StreamAudioHandle,
} from "../stream-audio-playback";
import type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsProvider,
  TtsProviderId,
} from "../types";

export interface TtsStatusVoice {
  id: string;
  label: string;
}

export interface TtsStatusResponse {
  available: boolean;
  activeProvider: "openai" | "elevenlabs" | "browser";
  provider: "openai" | "elevenlabs" | "browser";
  model: string | null;
  defaultVoice: string | null;
  voices: TtsStatusVoice[];
  defaultVoiceByLang: Record<string, string>;
  streaming: boolean;
}

export class CloudSpeechProvider implements TtsProvider {
  private _id: TtsProviderId = "openai";

  get id(): TtsProviderId {
    return this._id;
  }

  private listeners = new Set<SpeechStateListener>();
  private audioHandle: StreamAudioHandle | null = null;
  private currentMessageId: string | null = null;
  private playbackState: SpeechPlaybackState = "idle";
  private serverAvailable = false;
  private status: TtsStatusResponse | null = null;

  configure(status: TtsStatusResponse): void {
    this.status = status;
    this.serverAvailable = status.available;
    if (status.activeProvider === "openai" || status.activeProvider === "elevenlabs") {
      this._id = status.activeProvider;
    }
  }

  isSupported(): boolean {
    return this.serverAvailable;
  }

  getStatus(): TtsStatusResponse | null {
    return this.status;
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
    cleanupStreamAudio(this.audioHandle);
    this.audioHandle = null;
  }

  async speak(options: SpeakOptions): Promise<void> {
    if (typeof window === "undefined") return;

    this.stop();

    const text = sanitizeTextForSpeech(options.text);
    if (!text) return;

    const prefs = loadTtsPreferences();
    const lang = options.lang ?? "de-DE";
    const voiceUri = options.settings?.voiceUri ?? prefs.voiceUri;
    const speed = options.settings?.rate ?? prefs.rate;
    const volume = options.settings?.volume ?? prefs.volume;
    const provider = this.status?.activeProvider ?? "openai";

    this.setState("loading", options.messageId);

    try {
      const response = await fetch("/api/assistant/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang,
          provider,
          voiceUri,
          speed,
          stream: true,
        }),
      });

      if (!response.ok) {
        await this.fallbackToBrowser(options);
        return;
      }

      const handle = await playStreamingAudioResponse(
        response,
        volume,
        () => this.setState("playing", options.messageId)
      );

      this.audioHandle = handle;
      handle.audio.onended = () => {
        if (this.currentMessageId === options.messageId) {
          this.cleanupAudio();
          this.setState("idle", null);
        }
      };
      handle.audio.onerror = () => {
        if (this.currentMessageId === options.messageId) {
          this.cleanupAudio();
          this.setState("idle", null);
        }
      };
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
    if (!this.audioHandle || this.playbackState !== "playing") return;
    this.audioHandle.audio.pause();
    this.setState("paused");
  }

  resume(): void {
    if (!this.audioHandle || this.playbackState !== "paused") return;
    void this.audioHandle.audio.play();
    this.setState("playing");
  }

  stop(): void {
    this.cleanupAudio();
    this.setState("idle", null);
  }
}

let cloudInstance: CloudSpeechProvider | null = null;

export function getCloudSpeechProvider(): CloudSpeechProvider {
  if (!cloudInstance) {
    cloudInstance = new CloudSpeechProvider();
  }
  return cloudInstance;
}

/** Prüft Server-Verfügbarkeit und konfiguriert den Cloud-Provider. */
export async function probeCloudTtsAvailability(): Promise<TtsStatusResponse | null> {
  if (typeof window === "undefined") return null;

  try {
    const res = await fetch("/api/assistant/tts");
    if (!res.ok) return null;

    const data = (await res.json()) as TtsStatusResponse;
    getCloudSpeechProvider().configure(data);
    return data;
  } catch {
    getCloudSpeechProvider().configure({
      available: false,
      activeProvider: "browser",
      provider: "browser",
      model: null,
      defaultVoice: null,
      voices: [],
      defaultVoiceByLang: {},
      streaming: false,
    });
    return null;
  }
}

/** @deprecated Alias für Abwärtskompatibilität */
export const probeOpenAiTtsAvailability = async (): Promise<boolean> => {
  const status = await probeCloudTtsAvailability();
  return status?.available ?? false;
};

export function getOpenAiSpeechProvider(): CloudSpeechProvider {
  return getCloudSpeechProvider();
}

export function getElevenLabsSpeechProvider(): CloudSpeechProvider {
  return getCloudSpeechProvider();
}

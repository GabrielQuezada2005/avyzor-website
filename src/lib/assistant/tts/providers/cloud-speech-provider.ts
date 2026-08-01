/**
 * Text-to-Speech – Cloud Provider (ElevenLabs & OpenAI)
 *
 * Premium-Sprachausgabe über /api/assistant/tts mit Streaming-Wiedergabe.
 * Fallback: ElevenLabs → OpenAI → Browser (still, ohne Nutzer-Fehlermeldung).
 */

import { getBrowserSpeechProvider } from "./browser-speech-provider";
import { loadTtsPreferences } from "../preferences";
import { sanitizeTextForSpeech } from "../sanitize-for-speech";
import {
  cleanupStreamAudio,
  playStreamingAudioResponse,
  type StreamAudioHandle,
} from "../stream-audio-playback";
import {
  headersToRecord,
  logTtsDebugClient,
} from "../tts-debug-log";
import { fromElevenLabsVoiceUri } from "../elevenlabs-voices";
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

export interface TtsProviderStatus {
  available: boolean;
  model: string | null;
}

export interface TtsStatusResponse {
  available: boolean;
  activeProvider: "openai" | "elevenlabs" | "browser";
  provider: "openai" | "elevenlabs" | "browser";
  fallbackProvider: "openai" | "elevenlabs" | "browser" | null;
  model: string | null;
  defaultVoice: string | null;
  voices: TtsStatusVoice[];
  defaultVoiceByLang: Record<string, string>;
  streaming: boolean;
  providers?: {
    openai: TtsProviderStatus;
    elevenlabs: TtsProviderStatus;
  };
}

interface TtsRequestPayload {
  text: string;
  lang: string;
  provider: "openai" | "elevenlabs";
  voiceUri: string | null;
  speed: number;
}

export class CloudSpeechProvider implements TtsProvider {
  private _id: TtsProviderId = "elevenlabs";

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

  private resolveVoiceIdForLog(
    provider: "openai" | "elevenlabs",
    voiceUri: string | null | undefined,
    lang: string
  ): string {
    if (provider === "elevenlabs") {
      const fromUri = fromElevenLabsVoiceUri(voiceUri ?? null);
      if (fromUri) return fromUri;
      return this.status?.defaultVoice ?? "onwK4e9ZLuTAKqWW03F9";
    }
    return voiceUri?.replace(/^openai:/, "") ?? this.status?.defaultVoice ?? "unknown";
  }

  private logClientTtsDebug(
    response: Response,
    payload: TtsRequestPayload,
    audioSource: string
  ): void {
    const usedProvider =
      response.headers.get("X-TTS-Provider") ?? payload.provider;
    const providerForVoice =
      usedProvider === "openai" ? "openai" : "elevenlabs";

    logTtsDebugClient({
      ttsProvider: usedProvider,
      voiceId: this.resolveVoiceIdForLog(
        providerForVoice,
        payload.voiceUri,
        payload.lang
      ),
      model: this.status?.model ?? "unknown",
      responseStatus: response.status,
      audioSource,
      requestUrl: response.url || `${window.location.origin}/api/assistant/tts`,
      responseHeaders: headersToRecord(response.headers),
      phase: "client",
    });
  }

  private async requestTts(payload: TtsRequestPayload): Promise<Response> {
    const body: Record<string, unknown> = {
      text: payload.text,
      lang: payload.lang,
      provider: payload.provider,
      speed: payload.speed,
      stream: true,
    };
    if (payload.voiceUri) {
      body.voiceUri = payload.voiceUri;
    }

    return fetch("/api/assistant/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private async playResponse(
    response: Response,
    options: SpeakOptions,
    volume: number
  ): Promise<boolean> {
    try {
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
      return true;
    } catch {
      return false;
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
    const speed = options.settings?.rate ?? prefs.rate;
    const volume = options.settings?.volume ?? prefs.volume;

    const primary = this.status?.activeProvider ?? "elevenlabs";
    const payload: TtsRequestPayload = {
      text,
      lang,
      provider: primary === "openai" ? "openai" : "elevenlabs",
      voiceUri,
      speed,
    };

    this.setState("loading", options.messageId);

    try {
      let response = await this.requestTts(payload);

      if (
        !response.ok &&
        payload.provider === "elevenlabs" &&
        this.status?.providers?.openai.available
      ) {
        response = await this.requestTts({ ...payload, provider: "openai" });
        if (response.ok) {
          this._id = "openai";
        }
      }

      if (!response.ok) {
        this.logClientTtsDebug(response, payload, "none (HTTP error → Browser-Fallback)");
        await this.fallbackToBrowser(options);
        return;
      }

      const played = await this.playResponse(response, options, volume);
      if (!played) {
        this.logClientTtsDebug(
          response,
          payload,
          "none (Playback failed → Browser-Fallback)"
        );
        await this.fallbackToBrowser(options);
      } else {
        this.logClientTtsDebug(response, payload, "Cloud TTS (HTMLAudioElement / MP3)");
      }
    } catch {
      await this.fallbackToBrowser(options);
    }
  }

  private async fallbackToBrowser(options: SpeakOptions): Promise<void> {
    this.cleanupAudio();
    this.setState("idle", null);
    logTtsDebugClient({
      ttsProvider: "browser",
      voiceId: "N/A (Browser SpeechSynthesis)",
      model: "SpeechSynthesis",
      responseStatus: "N/A (no HTTP TTS request)",
      audioSource: "Browser SpeechSynthesis",
      requestUrl: "N/A",
      phase: "client-fallback",
    });
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
      fallbackProvider: null,
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

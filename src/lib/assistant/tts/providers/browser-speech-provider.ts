/**
 * Text-to-Speech – Browser Speech Synthesis Provider
 *
 * Standard-Implementierung über die native Web Speech API.
 * Nutzt gespeicherte Nutzer-Einstellungen (Stimme, Rate, Pitch, Volume).
 */

import { detectLanguageFromText } from "../detect-language";
import { loadVoices } from "../load-voices";
import {
  DEFAULT_TTS_PREFERENCES,
  loadTtsPreferences,
  type TtsPreferences,
} from "../preferences";
import {
  applyQuestionProsody,
  textIsOnlyQuestions,
} from "../apply-question-prosody";
import { sanitizeTextForSpeech } from "../sanitize-for-speech";
import { logTtsDebugClient } from "../tts-debug-log";
import { resolveVoice } from "../select-voice";
import type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsProvider,
  TtsVoiceSettings,
} from "../types";

function resolveSettings(
  override?: TtsVoiceSettings
): TtsVoiceSettings {
  const prefs = loadTtsPreferences();
  return {
    voiceUri: override?.voiceUri ?? prefs.voiceUri,
    rate: override?.rate ?? prefs.rate,
    pitch: override?.pitch ?? prefs.pitch,
    volume: override?.volume ?? prefs.volume,
  };
}

export class BrowserSpeechProvider implements TtsProvider {
  readonly id = "browser" as const;

  private listeners = new Set<SpeechStateListener>();
  private currentMessageId: string | null = null;
  private playbackState: SpeechPlaybackState = "idle";
  private utterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
    );
  }

  subscribe(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const snapshot = {
      messageId: this.currentMessageId,
      playbackState: this.playbackState,
    };
    this.listeners.forEach((l) => l(snapshot));
  }

  private setState(
    playbackState: SpeechPlaybackState,
    messageId: string | null = this.currentMessageId
  ): void {
    this.playbackState = playbackState;
    this.currentMessageId = messageId;
    this.emit();
  }

  async speak(options: SpeakOptions): Promise<void> {
    if (!this.isSupported()) return;

    this.stop();

    const sanitized = sanitizeTextForSpeech(options.text);
    if (!sanitized) return;

    const text = applyQuestionProsody(sanitized, "browser");
    const lang = options.lang ?? detectLanguageFromText(text);
    const voices = await loadVoices();
    const settings = resolveSettings(options.settings);
    const voiceUri = settings.voiceUri;
    const browserVoiceUri =
      voiceUri?.startsWith("openai:") || voiceUri?.startsWith("elevenlabs:")
        ? null
        : voiceUri;
    const voice = resolveVoice(voices, lang, browserVoiceUri);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (voice) utterance.voice = voice;
    utterance.rate = settings.rate ?? DEFAULT_TTS_PREFERENCES.rate;
    const basePitch = settings.pitch ?? DEFAULT_TTS_PREFERENCES.pitch;
    // Browser Speech API ohne SSML: stärkere Pitch-Erhöhung nur bei reinen Fragen
    utterance.pitch = textIsOnlyQuestions(text)
      ? Math.min(2, basePitch + 0.1)
      : basePitch;
    utterance.volume = settings.volume ?? DEFAULT_TTS_PREFERENCES.volume;

    this.utterance = utterance;
    this.setState("loading", options.messageId);

    logTtsDebugClient({
      ttsProvider: "browser",
      voiceId: voice?.voiceURI ?? voice?.name ?? "system-default",
      model: "SpeechSynthesis",
      responseStatus: "N/A (no HTTP TTS request)",
      audioSource: "Browser SpeechSynthesis",
      requestUrl: "N/A",
      phase: "client-browser-direct",
    });

    utterance.onstart = () => {
      this.setState("playing", options.messageId);
    };

    utterance.onend = () => {
      if (this.currentMessageId === options.messageId) {
        this.utterance = null;
        this.setState("idle", null);
      }
    };

    utterance.onerror = () => {
      if (this.currentMessageId === options.messageId) {
        this.utterance = null;
        this.setState("idle", null);
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  pause(): void {
    if (!this.isSupported() || this.playbackState !== "playing") return;
    window.speechSynthesis.pause();
    this.setState("paused");
  }

  resume(): void {
    if (!this.isSupported() || this.playbackState !== "paused") return;
    window.speechSynthesis.resume();
    this.setState("playing");
  }

  stop(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.utterance = null;
    this.setState("idle", null);
  }
}

/** Singleton für Browser-Provider. */
let browserInstance: BrowserSpeechProvider | null = null;

export function getBrowserSpeechProvider(): BrowserSpeechProvider {
  if (!browserInstance) {
    browserInstance = new BrowserSpeechProvider();
  }
  return browserInstance;
}

export type { TtsPreferences };

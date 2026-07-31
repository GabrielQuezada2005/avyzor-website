/**
 * Text-to-Speech – Browser Speech Synthesis Provider
 *
 * Standard-Implementierung über die native Web Speech API.
 */

import { detectLanguageFromText } from "../detect-language";
import { sanitizeTextForSpeech } from "../sanitize-for-speech";
import { selectBestVoice } from "../select-voice";
import type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsProvider,
} from "../types";

/** Lädt verfügbare Stimmen (asynchron in manchen Browsern). */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    const onVoicesChanged = () => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(synth.getVoices());
    };

    synth.addEventListener("voiceschanged", onVoicesChanged);

    // Fallback nach kurzer Wartezeit
    setTimeout(() => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(synth.getVoices());
    }, 250);
  });
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

    const text = sanitizeTextForSpeech(options.text);
    if (!text) return;

    const lang =
      options.lang ?? detectLanguageFromText(text);
    const voices = await loadVoices();
    const voice = selectBestVoice(voices, lang);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    this.utterance = utterance;
    this.setState("loading", options.messageId);

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

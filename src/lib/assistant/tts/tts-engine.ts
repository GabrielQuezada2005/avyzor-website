/**
 * Text-to-Speech – Engine
 *
 * Zentraler Orchestrator: verwaltet einen aktiven Provider,
 * beendet laufende Wiedergabe bei neuem Start und leitet Steuerung weiter.
 */

import { getBrowserSpeechProvider } from "./providers/browser-speech-provider";
import { getOpenAiSpeechProvider } from "./providers/openai-speech-provider";
import type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsEngineConfig,
  TtsProvider,
  TtsProviderId,
} from "./types";

export class TtsEngine {
  private provider: TtsProvider;
  private unsubscribeProvider: (() => void) | null = null;
  private listeners = new Set<SpeechStateListener>();

  constructor(config: TtsEngineConfig = {}) {
    this.provider = this.resolveProvider(config.preferredProvider);
    this.bindProvider(this.provider);
  }

  /** Wechselt den Anbieter zur Laufzeit (z. B. nach Feature-Flag). */
  setProvider(providerId: TtsProviderId): void {
    const next = this.resolveProvider(providerId);
    if (next.id === this.provider.id) return;

    this.provider.stop();
    this.unsubscribeProvider?.();
    this.provider = next;
    this.bindProvider(next);
  }

  get activeProviderId(): TtsProviderId {
    return this.provider.id;
  }

  subscribe(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Startet Wiedergabe – beendet automatisch vorherige. */
  async speak(options: SpeakOptions): Promise<void> {
    this.provider.stop();
    await this.provider.speak(options);
  }

  pause(): void {
    this.provider.pause();
  }

  resume(): void {
    this.provider.resume();
  }

  stop(): void {
    this.provider.stop();
  }

  private bindProvider(provider: TtsProvider): void {
    this.unsubscribeProvider = provider.subscribe((state) => {
      this.listeners.forEach((l) => l(state));
    });
  }

  private resolveProvider(preferred?: TtsProviderId): TtsProvider {
    const openai = getOpenAiSpeechProvider();
    const browser = getBrowserSpeechProvider();

    if (preferred === "openai" && openai.isSupported()) return openai;
    if (preferred === "browser" && browser.isSupported()) return browser;

    if (openai.isSupported()) return openai;
    return browser;
  }
}

/** Singleton – eine globale Engine für den gesamten Chat. */
let engineInstance: TtsEngine | null = null;

export function getTtsEngine(config?: TtsEngineConfig): TtsEngine {
  if (!engineInstance) {
    engineInstance = new TtsEngine(config);
  }
  return engineInstance;
}

export type { SpeechPlaybackState, SpeakOptions, SpeechStateListener };

/**
 * Voice Mode – STT Engine
 *
 * Zentraler Orchestrator für Speech-to-Text.
 * Wählt Provider, verwaltet Aufnahme-Status.
 */

import { getBrowserSttProvider } from "./providers/browser-stt-provider";
import { getOpenAiRealtimeProvider } from "./providers/openai-realtime-provider";
import { getOpenAiSttProvider } from "./providers/openai-stt-provider";
import type {
  RecordingState,
  SttEngineConfig,
  SttProvider,
  SttProviderId,
  SttStartOptions,
  SttStateListener,
} from "./types";

export class SttEngine {
  private provider: SttProvider;
  private unsubscribeProvider: (() => void) | null = null;
  private listeners = new Set<SttStateListener>();

  constructor(config: SttEngineConfig = {}) {
    this.provider = this.resolveProvider(config.preferredProvider);
    this.bindProvider(this.provider);
  }

  get activeProviderId(): SttProviderId {
    return this.provider.id;
  }

  isSupported(): boolean {
    return this.provider.isSupported();
  }

  subscribe(listener: SttStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start(options: SttStartOptions): void {
    this.provider.abort();
    this.provider.start(options);
  }

  stop(): void {
    this.provider.stop();
  }

  abort(): void {
    this.provider.abort();
  }

  setProvider(providerId: SttProviderId): void {
    const next = this.resolveProvider(providerId);
    if (next.id === this.provider.id) return;

    this.provider.abort();
    this.unsubscribeProvider?.();
    this.provider = next;
    this.bindProvider(next);
  }

  private bindProvider(provider: SttProvider): void {
    this.unsubscribeProvider = provider.subscribe((state) => {
      this.listeners.forEach((l) => l(state));
    });
  }

  private resolveProvider(preferred?: SttProviderId): SttProvider {
    const realtime = getOpenAiRealtimeProvider();
    const openai = getOpenAiSttProvider();
    const browser = getBrowserSttProvider();

    if (preferred === "openai-realtime" && realtime.isSupported()) return realtime;
    if (preferred === "openai" && openai.isSupported()) return openai;
    if (preferred === "browser" && browser.isSupported()) return browser;

    if (realtime.isSupported()) return realtime;
    if (openai.isSupported()) return openai;
    return browser;
  }
}

let engineInstance: SttEngine | null = null;

export function getSttEngine(config?: SttEngineConfig): SttEngine {
  if (!engineInstance) {
    engineInstance = new SttEngine(config);
  }
  return engineInstance;
}

export type { RecordingState, SttStartOptions, SttStateListener };

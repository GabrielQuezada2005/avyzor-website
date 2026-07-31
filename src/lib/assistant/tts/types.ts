/**
 * Text-to-Speech – Typdefinitionen
 *
 * Abstraktion für Browser-Speech-Synthesis und zukünftige Premium-Anbieter
 * (z. B. OpenAI Text-to-Speech).
 */

/** Wiedergabe-Status einer Nachricht. */
export type SpeechPlaybackState = "idle" | "loading" | "playing" | "paused";

/** Unterstützte TTS-Anbieter. */
export type TtsProviderId = "browser" | "openai";

/** Optionen für eine einzelne Wiedergabe. */
export interface SpeakOptions {
  messageId: string;
  text: string;
  /** BCP-47 Sprachcode, z. B. de-DE – optional, wird sonst erkannt. */
  lang?: string;
  /** Überschreibt gespeicherte Nutzer-Einstellungen für diese Wiedergabe. */
  settings?: TtsVoiceSettings;
}

/** Stimme & Wiedergabe-Parameter (Browser Speech Synthesis). */
export interface TtsVoiceSettings {
  voiceUri: string | null;
  rate: number;
  pitch: number;
  volume: number;
}

/** Callback bei Statusänderungen. */
export type SpeechStateListener = (state: {
  messageId: string | null;
  playbackState: SpeechPlaybackState;
}) => void;

/**
 * Provider-Interface – jeder Anbieter (Browser, OpenAI, …) implementiert dieses Interface.
 */
export interface TtsProvider {
  readonly id: TtsProviderId;
  /** Ob der Anbieter in der aktuellen Umgebung nutzbar ist. */
  isSupported(): boolean;
  /** Startet die Wiedergabe. Beendet ggf. laufende Wiedergabe desselben Providers. */
  speak(options: SpeakOptions): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
  /** Registriert Listener für Statusänderungen. Gibt Unsubscribe-Funktion zurück. */
  subscribe(listener: SpeechStateListener): () => void;
}

/** Öffentliche Engine-Konfiguration. */
export interface TtsEngineConfig {
  /** Bevorzugter Anbieter – fällt bei Nicht-Verfügbarkeit auf Browser zurück. */
  preferredProvider?: TtsProviderId;
  /** Standard-Sprache, wenn Erkennung unsicher ist. */
  defaultLang?: string;
}

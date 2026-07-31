/**
 * Voice Mode – Typdefinitionen
 *
 * Abstraktion für Speech-to-Text, Voice-Mode-Steuerung
 * und zukünftige OpenAI Realtime / Whisper-Integration.
 */

/** Nutzer wählbare Interaktionsmodi. */
export type VoiceMode = "text-only" | "text-and-voice" | "voice-only";

/** STT-Anbieter-IDs. */
export type SttProviderId = "browser" | "openai" | "openai-realtime";

/** Aufnahme-Status des Mikrofons. */
export type RecordingState = "idle" | "recording" | "processing";

/** Callback bei STT-Statusänderungen. */
export type SttStateListener = (state: {
  recordingState: RecordingState;
  interimTranscript: string;
}) => void;

/** Optionen zum Starten einer Spracherkennung. */
export interface SttStartOptions {
  lang: string;
  onInterim?: (transcript: string) => void;
  onFinal: (transcript: string) => void;
  onEnd?: () => void;
}

/**
 * Provider-Interface für Speech-to-Text.
 * Browser (Web Speech API), OpenAI Whisper und Realtime implementieren dieses Interface.
 */
export interface SttProvider {
  readonly id: SttProviderId;
  isSupported(): boolean;
  start(options: SttStartOptions): void;
  stop(): void;
  abort(): void;
  subscribe(listener: SttStateListener): () => void;
}

/** Konfiguration der STT-Engine. */
export interface SttEngineConfig {
  preferredProvider?: SttProviderId;
}

/** Voice-Mode-Einstellungen (persistierbar). */
export interface VoicePreferences {
  mode: VoiceMode;
  language: string;
}

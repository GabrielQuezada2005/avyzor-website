/**
 * Voice Mode – öffentliche API
 */

export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageLabel,
} from "./languages";
export { getSttEngine, SttEngine } from "./stt-engine";
export { getBrowserSttProvider } from "./providers/browser-stt-provider";
export { getOpenAiSttProvider } from "./providers/openai-stt-provider";
export { getOpenAiRealtimeProvider } from "./providers/openai-realtime-provider";
export {
  isVoiceModeActive,
  loadVoicePreferences,
  saveVoicePreferences,
  shouldAutoSpeakResponses,
} from "./preferences";
export type {
  VoiceMode,
  VoicePreferences,
  SttProvider,
  SttProviderId,
  SttEngineConfig,
  RecordingState,
  SttStartOptions,
  SttStateListener,
} from "./types";

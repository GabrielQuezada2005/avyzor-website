/**
 * Text-to-Speech – öffentliche API
 */

export { detectLanguageFromText } from "./detect-language";
export { sanitizeTextForSpeech } from "./sanitize-for-speech";
export {
  selectBestVoice,
  rankVoicesForLanguage,
  scoreVoice,
  resolveVoice,
} from "./select-voice";
export { loadVoices, loadVoicesForLanguage } from "./load-voices";
export {
  DEFAULT_TTS_RATE,
  DEFAULT_TTS_PREFERENCES,
  loadTtsPreferences,
  saveTtsPreferences,
  updateTtsPreferences,
  subscribeTtsPreferences,
  resetTtsPreferences,
} from "./preferences";
export { getTtsEngine, TtsEngine } from "./tts-engine";
export { getBrowserSpeechProvider } from "./providers/browser-speech-provider";
export {
  getCloudSpeechProvider,
  probeCloudTtsAvailability,
  type TtsStatusResponse,
} from "./providers/cloud-speech-provider";
export {
  OPENAI_TTS_VOICES,
  DEFAULT_OPENAI_VOICE_BY_LANG,
  resolveOpenAiVoice,
  toOpenAiVoiceUri,
  isOpenAiVoiceUri,
} from "./openai-voices";
export {
  ELEVENLABS_TTS_VOICES,
  DEFAULT_ELEVENLABS_VOICE_BY_LANG,
  resolveElevenLabsVoice,
  toElevenLabsVoiceUri,
  isElevenLabsVoiceUri,
} from "./elevenlabs-voices";
export { probeOpenAiTtsAvailability } from "./providers/openai-speech-provider";
export type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsEngineConfig,
  TtsProvider,
  TtsProviderId,
  TtsVoiceSettings,
} from "./types";
export type { TtsPreferences } from "./preferences";

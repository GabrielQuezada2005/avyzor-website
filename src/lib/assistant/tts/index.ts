/**
 * Text-to-Speech – öffentliche API
 */

export { detectLanguageFromText } from "./detect-language";
export { sanitizeTextForSpeech } from "./sanitize-for-speech";
export { selectBestVoice } from "./select-voice";
export { getTtsEngine, TtsEngine } from "./tts-engine";
export { getBrowserSpeechProvider } from "./providers/browser-speech-provider";
export { getOpenAiSpeechProvider } from "./providers/openai-speech-provider";
export type {
  SpeakOptions,
  SpeechPlaybackState,
  SpeechStateListener,
  TtsEngineConfig,
  TtsProvider,
  TtsProviderId,
} from "./types";

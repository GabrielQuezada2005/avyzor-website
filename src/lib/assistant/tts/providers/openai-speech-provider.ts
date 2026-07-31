/**
 * @deprecated Nutze cloud-speech-provider.ts – Alias für Abwärtskompatibilität.
 */
export {
  CloudSpeechProvider as OpenAiSpeechProvider,
  getCloudSpeechProvider as getOpenAiSpeechProvider,
  probeCloudTtsAvailability,
  probeOpenAiTtsAvailability,
} from "./cloud-speech-provider";

export { toOpenAiVoiceUri, resolveOpenAiVoice } from "../openai-voices";

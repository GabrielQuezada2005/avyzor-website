import { z } from "zod";
import { OPENAI_TTS_VOICES, type OpenAiTtsVoiceId } from "./openai-voices";

const openAiVoiceIds = OPENAI_TTS_VOICES.map((v) => v.id) as [
  OpenAiTtsVoiceId,
  ...OpenAiTtsVoiceId[],
];

export const ttsRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text darf nicht leer sein.")
    .max(4096, "Text ist zu lang für TTS (max. 4.096 Zeichen)."),
  lang: z.string().trim().min(2).max(12).optional(),
  provider: z.enum(["openai", "elevenlabs"]).optional(),
  voiceUri: z.string().min(1).max(128).optional(),
  voice: z.string().min(1).max(64).optional(),
  speed: z.number().min(0.25).max(4).optional(),
  stream: z.boolean().optional(),
});

export type TtsRequest = z.infer<typeof ttsRequestSchema>;

/** Legacy-Schema für OpenAI-only Voice-Enum (Abwärtskompatibilität). */
export const ttsRequestSchemaLegacy = ttsRequestSchema.extend({
  voice: z.enum(openAiVoiceIds).optional(),
});

export type TtsRequestLegacy = z.infer<typeof ttsRequestSchemaLegacy>;

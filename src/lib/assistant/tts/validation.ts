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
  voice: z.enum(openAiVoiceIds).optional(),
  speed: z.number().min(0.25).max(4).optional(),
});

export type TtsRequest = z.infer<typeof ttsRequestSchema>;

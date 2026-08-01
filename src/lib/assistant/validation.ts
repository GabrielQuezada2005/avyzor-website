import { z } from "zod";
import { localeCodes } from "@/i18n/locale-config";

export const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .min(1, "Nachricht darf nicht leer sein.")
    .max(2000, "Nachricht ist zu lang (max. 2.000 Zeichen)."),
});

export const assistantRequestSchema = z.object({
  messages: z
    .array(assistantMessageSchema)
    .min(1, "Mindestens eine Nachricht erforderlich.")
    .max(40, "Konversationsverlauf ist zu lang."),
  /** Optionale Session-ID für internes Lead-Scoring (unsichtbar für Nutzer). */
  sessionId: z
    .string()
    .trim()
    .min(8, "Session-ID zu kurz.")
    .max(64, "Session-ID zu lang.")
    .optional(),
  locale: z.enum(localeCodes).optional(),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

import { z } from "zod";

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
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

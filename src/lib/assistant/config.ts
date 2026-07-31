import type { AssistantConfig } from "./types";

export const ASSISTANT_CONFIG: AssistantConfig = {
  name: "AVYZOR Assistant",
  tagline: "Ihr Premium-Berater",
  welcomeMessage:
    "Schön, dass Sie da sind. Ich berate Sie gerne zu Leistungen, Preisen und Projektabläufen. Was ist Ihr Anliegen?",
  placeholder: "Ihre Nachricht eingeben…",
  statusMessage: "Premium KI-Beratung · Antworten in Echtzeit",
  quickReplies: [
    {
      id: "services",
      label: "Leistungen",
      message: "Welche Leistungen bietet AVYZOR an?",
    },
    {
      id: "pricing",
      label: "Preise",
      message: "Was kosten eure Pakete?",
    },
    {
      id: "contact",
      label: "Kontakt",
      message: "Wie kann ich euch kontaktieren?",
    },
    {
      id: "timeline",
      label: "Projektdauer",
      message: "Wie lange dauert ein typisches Projekt?",
    },
  ],
};

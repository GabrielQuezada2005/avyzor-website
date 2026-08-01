/**
 * Pflicht-Namespaces pro Locale – für Validierung und neue Sprachen.
 */

export const MESSAGE_NAMESPACES = [
  "metadata",
  "nav",
  "header",
  "footer",
  "hero",
  "services",
  "pricing",
  "why",
  "portfolio",
  "testimonials",
  "faq",
  "contact",
  "cta",
  "forms",
  "assistant",
  "voice",
  "tts",
  "notFound",
  "newsletter",
  "legal",
  "common",
  "skipLink",
] as const;

export type MessageNamespace = (typeof MESSAGE_NAMESPACES)[number];

export const MESSAGE_NAMESPACE_FILES: Record<MessageNamespace, string> = {
  metadata: "metadata.ts",
  nav: "nav.ts",
  header: "header.ts",
  footer: "footer.ts",
  hero: "hero.ts",
  services: "services.ts",
  pricing: "pricing.ts",
  why: "why.ts",
  portfolio: "portfolio.ts",
  testimonials: "testimonials.ts",
  faq: "faq.ts",
  contact: "contact.ts",
  cta: "cta.ts",
  forms: "forms.ts",
  assistant: "assistant.ts",
  voice: "voice.ts",
  tts: "tts.ts",
  notFound: "notFound.ts",
  newsletter: "newsletter.ts",
  legal: "legal.ts",
  common: "common.ts",
  skipLink: "skipLink.ts",
};

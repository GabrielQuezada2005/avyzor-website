/** Non-translatable IDs and icon mappings for i18n message lookups. */

export const NAV_IDS = [
  "services",
  "pricing",
  "why",
  "portfolio",
  "testimonials",
  "faq",
  "contact",
] as const;

export const NAV_HREFS: Record<(typeof NAV_IDS)[number], string> = {
  services: "/#leistungen",
  pricing: "/#preise",
  why: "/#warum-avyzor",
  portfolio: "/#portfolio",
  testimonials: "/#bewertungen",
  faq: "/#faq",
  contact: "/#kontakt",
};

export const SERVICE_IDS = [
  "premium-websites",
  "ki-chatbots",
  "ki-automatisierungen",
  "terminbuchung",
  "crm-integration",
  "seo",
  "wartung",
] as const;

export const SERVICE_ICONS: Record<(typeof SERVICE_IDS)[number], string> = {
  "premium-websites": "Globe",
  "ki-chatbots": "Bot",
  "ki-automatisierungen": "Zap",
  terminbuchung: "Calendar",
  "crm-integration": "Link",
  seo: "Search",
  wartung: "Shield",
};

export const PRICING_IDS = ["neukunde", "starter", "professional", "enterprise"] as const;

export const PRICING_PLAN_IDS = ["starter", "professional", "enterprise"] as const;

export const PRICING_HIGHLIGHTED = "professional" as const;

export const WHY_IDS = [
  "premium-qualitaet",
  "ki-expertise",
  "messbare-ergebnisse",
  "persoenlicher-service",
] as const;

export const WHY_ICONS: Record<(typeof WHY_IDS)[number], string> = {
  "premium-qualitaet": "Award",
  "ki-expertise": "Brain",
  "messbare-ergebnisse": "TrendingUp",
  "persoenlicher-service": "Users",
};

export const PORTFOLIO_IDS = ["1", "2", "3", "4"] as const;

export const PORTFOLIO_IMAGES: Record<(typeof PORTFOLIO_IDS)[number], string> = {
  "1": "/portfolio/luxus-immobilien.jpg",
  "2": "/portfolio/medtech-ki-assistent.jpg",
  "3": "/portfolio/fintech-automatisierung.jpg",
  "4": "/portfolio/premium-ecommerce.jpg",
};

export const TESTIMONIAL_IDS = ["1", "2", "3", "4"] as const;

export const FAQ_IDS = ["1", "2", "3", "4", "5", "6"] as const;

export const CONTACT_TAB_IDS = ["contact", "quote", "booking"] as const;

export const ASSISTANT_QUICK_REPLY_IDS = [
  "services",
  "pricing",
  "contact",
  "timeline",
] as const;

export const VOICE_MODES = ["text-only", "text-and-voice", "voice-only"] as const;

export const NEWSLETTER_ERROR_REASONS = ["invalid", "not_found", "server"] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type PricingId = (typeof PRICING_IDS)[number];
export type WhyId = (typeof WHY_IDS)[number];
export type PortfolioId = (typeof PORTFOLIO_IDS)[number];
export type TestimonialId = (typeof TESTIMONIAL_IDS)[number];
export type FaqId = (typeof FAQ_IDS)[number];
export type NavId = (typeof NAV_IDS)[number];
export type ContactTabId = (typeof CONTACT_TAB_IDS)[number];
export type VoiceMode = (typeof VOICE_MODES)[number];

/**
 * Client-sichere Umgebungsvariablen (NEXT_PUBLIC_*).
 * Secrets gehören ausschließlich in env.ts / env.server.ts.
 */

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",

  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? "AVYZOR",
    email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? "kontakt@avyzor.de",
    phone: process.env.NEXT_PUBLIC_SITE_PHONE ?? "",
    phoneHref: process.env.NEXT_PUBLIC_SITE_PHONE_HREF ?? "",
    whatsapp: process.env.NEXT_PUBLIC_SITE_WHATSAPP ?? "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? "",
    addressStreet: process.env.NEXT_PUBLIC_ADDRESS_STREET ?? "",
    addressCity: process.env.NEXT_PUBLIC_ADDRESS_CITY ?? "",
    addressZip: process.env.NEXT_PUBLIC_ADDRESS_ZIP ?? "",
    addressCountry: process.env.NEXT_PUBLIC_ADDRESS_COUNTRY ?? "Deutschland",
    legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "",
    legalRepresentative: process.env.NEXT_PUBLIC_LEGAL_REPRESENTATIVE ?? "",
    vatId: process.env.NEXT_PUBLIC_VAT_ID ?? "",
    registerCourt: process.env.NEXT_PUBLIC_REGISTER_COURT ?? "",
    registerNumber: process.env.NEXT_PUBLIC_REGISTER_NUMBER ?? "",
  },

  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },

  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  },
} as const;

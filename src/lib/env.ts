/**
 * Centralized environment configuration.
 * Production values must be set in Vercel / .env.local.
 */

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "AVYZOR <noreply@avyzor.de>",
    to: process.env.EMAIL_TO ?? "kontakt@avyzor.de",
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    priceStarter: process.env.STRIPE_PRICE_STARTER ?? "",
    priceProfessional: process.env.STRIPE_PRICE_PROFESSIONAL ?? "",
    priceEnterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? "",
  },

  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",

  turnstile: {
    secretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  },

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
} as const;

export function isSupabaseConfigured(): boolean {
  const url = env.supabase.url.trim();
  const anonKey = env.supabase.anonKey.trim();
  const serviceRoleKey = env.supabase.serviceRoleKey.trim();

  return Boolean(
    url &&
      anonKey &&
      serviceRoleKey &&
      !url.includes("your-project") &&
      !anonKey.includes("your-anon") &&
      !serviceRoleKey.includes("your-service")
  );
}

export function isResendConfigured(): boolean {
  return Boolean(
    env.resend.apiKey && !env.resend.apiKey.includes("your_api_key")
  );
}

export function isStripeConfigured(): boolean {
  const key = env.stripe.secretKey;
  return Boolean(
    key &&
      !key.includes("your_key") &&
      !key.startsWith("sk_your")
  );
}

export function isStripePricingConfigured(): boolean {
  return Boolean(
    isStripeConfigured() &&
      env.stripe.priceStarter &&
      env.stripe.priceProfessional &&
      env.stripe.priceEnterprise
  );
}

export function isTurnstileConfigured(): boolean {
  return Boolean(env.turnstile.secretKey && env.turnstile.siteKey);
}

/** Returns true when form submission backends are ready for production use. */
export function isFormBackendReady(): boolean {
  return isSupabaseConfigured() && isResendConfigured();
}

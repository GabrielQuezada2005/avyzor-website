import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

function createAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function createBrowserClient(): SupabaseClient | null {
  const url = env.supabase.url.trim();
  const anonKey = env.supabase.anonKey.trim();
  if (!url || !anonKey || url.includes("your-project")) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabaseAdmin = createAdminClient();
export const supabaseBrowser = createBrowserClient();

export const SUPABASE_SCHEMA = `
-- Leads Tabelle
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  service TEXT,
  source TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Abonnenten (Double-Opt-In)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  confirmation_token TEXT UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT FALSE
);

-- Angebotsanfragen
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terminbuchungen
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM-Leads (KI-Assistent / Chat Lead-Erkennung)
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  service TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'neu',
  source TEXT NOT NULL DEFAULT 'assistant',
  interest_level TEXT,
  completeness_score INTEGER NOT NULL DEFAULT 0,
  detected_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRM-Angebotsentwürfe (automatisch aus Leads)
CREATE TABLE IF NOT EXISTS crm_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL UNIQUE REFERENCES crm_leads(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  draft JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRM-E-Mail-Protokoll
CREATE TABLE IF NOT EXISTS crm_email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  has_attachment BOOLEAN NOT NULL DEFAULT FALSE,
  attachment_name TEXT,
  body_preview TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRM-Terminbuchungen
CREATE TABLE IF NOT EXISTS crm_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  notes TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Berlin',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'confirmed',
  calendar_provider TEXT,
  external_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRM-Zahlungen (Stripe Checkout)
CREATE TABLE IF NOT EXISTS crm_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES crm_quotes(id) ON DELETE SET NULL,
  invoice_id UUID,
  reference_type TEXT NOT NULL DEFAULT 'plan',
  reference_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kundenportal-Benutzer
CREATE TABLE IF NOT EXISTS portal_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security aktivieren
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;

-- Kein öffentlicher Lese-/Schreibzugriff (nur Service Role über API)
CREATE POLICY "Deny anon access leads" ON leads FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access newsletter" ON newsletter_subscribers FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access quotes" ON quote_requests FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access bookings" ON bookings FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access crm_leads" ON crm_leads FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access crm_quotes" ON crm_quotes FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access crm_email_logs" ON crm_email_logs FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access crm_appointments" ON crm_appointments FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access crm_payments" ON crm_payments FOR ALL TO anon USING (false);
CREATE POLICY "Deny anon access portal_users" ON portal_users FOR ALL TO anon USING (false);

-- Migration für bestehende Newsletter-Tabelle:
-- ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE;
-- ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
-- ALTER TABLE newsletter_subscribers ALTER COLUMN active SET DEFAULT FALSE;
`;

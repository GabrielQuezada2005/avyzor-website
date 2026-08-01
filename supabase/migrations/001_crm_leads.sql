-- CRM-Leads aus dem KI-Assistenten (Chat Lead-Erkennung)
-- In Supabase SQL Editor ausführen oder via Migration deployen.

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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_leads_status_check CHECK (
    status IN ('neu', 'in_bearbeitung', 'angebot_gesendet', 'kunde', 'abgelehnt')
  )
);

CREATE INDEX IF NOT EXISTS crm_leads_status_idx ON crm_leads (status);
CREATE INDEX IF NOT EXISTS crm_leads_created_at_idx ON crm_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS crm_leads_updated_at_idx ON crm_leads (updated_at DESC);

ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access crm_leads"
  ON crm_leads FOR ALL TO anon USING (false);

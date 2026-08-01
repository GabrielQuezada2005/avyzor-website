-- Angebotsentwürfe für CRM-Leads (automatisch generiert)
-- In Supabase SQL Editor ausführen oder via Migration deployen.

CREATE TABLE IF NOT EXISTS crm_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL UNIQUE REFERENCES crm_leads(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  draft JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_quotes_status_check CHECK (
    status IN ('draft', 'sent', 'accepted', 'expired')
  )
);

CREATE INDEX IF NOT EXISTS crm_quotes_lead_id_idx ON crm_quotes (lead_id);
CREATE INDEX IF NOT EXISTS crm_quotes_created_at_idx ON crm_quotes (created_at DESC);

ALTER TABLE crm_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access crm_quotes"
  ON crm_quotes FOR ALL TO anon USING (false);

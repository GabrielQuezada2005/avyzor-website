-- E-Mail-Protokoll für CRM-Leads
-- In Supabase SQL Editor ausführen oder via Migration deployen.

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_email_logs_status_check CHECK (
    status IN ('sent', 'failed', 'skipped_not_configured', 'dry_run')
  )
);

CREATE INDEX IF NOT EXISTS crm_email_logs_lead_id_idx ON crm_email_logs (lead_id);
CREATE INDEX IF NOT EXISTS crm_email_logs_created_at_idx ON crm_email_logs (created_at DESC);

ALTER TABLE crm_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access crm_email_logs"
  ON crm_email_logs FOR ALL TO anon USING (false);

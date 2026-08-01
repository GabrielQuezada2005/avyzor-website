-- Kundenportal – Benutzerkonten und Rollen
-- In Supabase SQL Editor ausführen oder via Migration deployen.

CREATE TABLE IF NOT EXISTS portal_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT portal_users_role_check CHECK (
    role IN ('admin', 'employee', 'customer')
  )
);

CREATE INDEX IF NOT EXISTS portal_users_email_idx ON portal_users (email);
CREATE INDEX IF NOT EXISTS portal_users_lead_id_idx ON portal_users (lead_id);

ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access portal_users"
  ON portal_users FOR ALL TO anon USING (false);

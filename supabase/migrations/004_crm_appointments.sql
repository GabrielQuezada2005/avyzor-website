-- CRM-Terminbuchungen (Website + spätere Kalender-Sync)
-- In Supabase SQL Editor ausführen oder via Migration deployen.

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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_appointments_status_check CHECK (
    status IN ('confirmed', 'cancelled', 'completed', 'no_show')
  ),
  CONSTRAINT crm_appointments_slot_unique UNIQUE (scheduled_date, scheduled_time)
);

CREATE INDEX IF NOT EXISTS crm_appointments_lead_id_idx ON crm_appointments (lead_id);
CREATE INDEX IF NOT EXISTS crm_appointments_email_idx ON crm_appointments (email);
CREATE INDEX IF NOT EXISTS crm_appointments_scheduled_date_idx ON crm_appointments (scheduled_date);

ALTER TABLE crm_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access crm_appointments"
  ON crm_appointments FOR ALL TO anon USING (false);

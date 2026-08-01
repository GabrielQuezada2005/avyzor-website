-- Zahlungen für CRM (Stripe Checkout) – verknüpfbar mit Angeboten und Rechnungen
-- In Supabase SQL Editor ausführen oder via Migration deployen.

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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT crm_payments_status_check CHECK (
    status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')
  ),
  CONSTRAINT crm_payments_reference_type_check CHECK (
    reference_type IN ('plan', 'quote', 'invoice')
  ),
  CONSTRAINT crm_payments_payment_method_check CHECK (
    payment_method IS NULL OR payment_method IN (
      'card', 'paypal', 'klarna', 'apple_pay', 'google_pay'
    )
  )
);

CREATE INDEX IF NOT EXISTS crm_payments_lead_id_idx ON crm_payments (lead_id);
CREATE INDEX IF NOT EXISTS crm_payments_quote_id_idx ON crm_payments (quote_id);
CREATE INDEX IF NOT EXISTS crm_payments_invoice_id_idx ON crm_payments (invoice_id);
CREATE INDEX IF NOT EXISTS crm_payments_status_idx ON crm_payments (status);
CREATE INDEX IF NOT EXISTS crm_payments_created_at_idx ON crm_payments (created_at DESC);
CREATE INDEX IF NOT EXISTS crm_payments_stripe_session_idx
  ON crm_payments (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

ALTER TABLE crm_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon access crm_payments"
  ON crm_payments FOR ALL TO anon USING (false);

-- Cookie Consent Tracking Table
-- Tracks user cookie preferences for KVKK/GDPR compliance and analytics

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('all', 'essential', 'custom')),
  analytics_accepted BOOLEAN DEFAULT FALSE,
  marketing_accepted BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert their consent choices
CREATE POLICY "Allow anonymous insert" ON cookie_consents
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users (admins) to read all consents
CREATE POLICY "Allow authenticated read" ON cookie_consents
  FOR SELECT TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX idx_cookie_consents_created_at ON cookie_consents(created_at DESC);
CREATE INDEX idx_cookie_consents_type ON cookie_consents(consent_type);
CREATE INDEX idx_cookie_consents_visitor ON cookie_consents(visitor_id);

-- Comment on table
COMMENT ON TABLE cookie_consents IS 'Stores user cookie consent preferences for KVKK/GDPR compliance';

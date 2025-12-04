-- Migration: Add contact_submissions and newsletter_subscriptions tables
-- Date: 2025-12-04
-- Description: Tables for contact form and newsletter with reCAPTCHA score tracking

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  recaptcha_score DECIMAL(3,2),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  is_spam BOOLEAN DEFAULT FALSE
);

-- Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'tr',
  source TEXT DEFAULT 'footer',
  recaptcha_score DECIMAL(3,2),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_submissions
CREATE POLICY "Allow anonymous insert on contact_submissions" 
  ON contact_submissions
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on contact_submissions" 
  ON contact_submissions
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated update on contact_submissions" 
  ON contact_submissions
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- RLS Policies for newsletter_subscriptions
CREATE POLICY "Allow anonymous insert on newsletter_subscriptions" 
  ON newsletter_subscriptions
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on newsletter_subscriptions" 
  ON newsletter_subscriptions
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated update on newsletter_subscriptions" 
  ON newsletter_subscriptions
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_read 
  ON contact_submissions(is_read);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email 
  ON newsletter_subscriptions(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_is_active 
  ON newsletter_subscriptions(is_active);

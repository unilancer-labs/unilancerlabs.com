-- Create digibot_waitlist table for storing email signups
CREATE TABLE IF NOT EXISTS digibot_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'digibot_landing',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_digibot_waitlist_email ON digibot_waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_digibot_waitlist_created_at ON digibot_waitlist(created_at DESC);

-- Enable RLS
ALTER TABLE digibot_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (for waitlist signups)
CREATE POLICY "Allow anonymous insert" ON digibot_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON digibot_waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment
COMMENT ON TABLE digibot_waitlist IS 'Email waitlist for digiBot launch notifications';

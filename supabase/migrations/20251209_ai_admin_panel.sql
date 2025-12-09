-- AI Admin Panel Database Schema
-- Run this in Supabase SQL Editor

-- ==========================================
-- 1. DigiBot Configuration Table (if not exists)
-- ==========================================
CREATE TABLE IF NOT EXISTS digibot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL DEFAULT 'default' UNIQUE,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  max_tokens INTEGER NOT NULL DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for digibot_config
ALTER TABLE digibot_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access digibot_config" ON digibot_config;
CREATE POLICY "Admin full access digibot_config" ON digibot_config
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- 2. AI Budget Configuration Table
-- ==========================================
CREATE TABLE IF NOT EXISTS ai_budget_config (
  id TEXT PRIMARY KEY DEFAULT '1',
  monthly_budget_usd DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
  alert_threshold_percent INTEGER NOT NULL DEFAULT 80,
  auto_disable_on_exceed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for ai_budget_config
ALTER TABLE ai_budget_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access ai_budget" ON ai_budget_config;
CREATE POLICY "Admin full access ai_budget" ON ai_budget_config
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Insert default budget config
INSERT INTO ai_budget_config (id, monthly_budget_usd, alert_threshold_percent, auto_disable_on_exceed)
VALUES ('1', 50.00, 80, false)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. Enhance report_chat_conversations table
-- ==========================================

-- Ensure RLS is properly configured for insert
ALTER TABLE report_chat_conversations ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert (for edge functions)
DROP POLICY IF EXISTS "Service role full access" ON report_chat_conversations;
CREATE POLICY "Service role full access" ON report_chat_conversations
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Allow anon to insert (for public chat)
DROP POLICY IF EXISTS "Anon insert access" ON report_chat_conversations;
CREATE POLICY "Anon insert access" ON report_chat_conversations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated to read all
DROP POLICY IF EXISTS "Authenticated read all" ON report_chat_conversations;
CREATE POLICY "Authenticated read all" ON report_chat_conversations
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated to insert
DROP POLICY IF EXISTS "Authenticated insert" ON report_chat_conversations;
CREATE POLICY "Authenticated insert" ON report_chat_conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add model_used column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'report_chat_conversations' AND column_name = 'model_used'
  ) THEN
    ALTER TABLE report_chat_conversations ADD COLUMN model_used TEXT DEFAULT 'gpt-4o-mini';
  END IF;

  -- Add prompt_tokens column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'report_chat_conversations' AND column_name = 'prompt_tokens'
  ) THEN
    ALTER TABLE report_chat_conversations ADD COLUMN prompt_tokens INTEGER DEFAULT 0;
  END IF;

  -- Add completion_tokens column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'report_chat_conversations' AND column_name = 'completion_tokens'
  ) THEN
    ALTER TABLE report_chat_conversations ADD COLUMN completion_tokens INTEGER DEFAULT 0;
  END IF;

  -- Add response_latency_ms column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'report_chat_conversations' AND column_name = 'response_latency_ms'
  ) THEN
    ALTER TABLE report_chat_conversations ADD COLUMN response_latency_ms INTEGER DEFAULT 0;
  END IF;
END $$;

-- ==========================================
-- 4. AI Usage Summary Table (for faster queries)
-- ==========================================
CREATE TABLE IF NOT EXISTS ai_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  total_requests INTEGER DEFAULT 0,
  total_prompt_tokens INTEGER DEFAULT 0,
  total_completion_tokens INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, model)
);

-- RLS for ai_usage_summary
ALTER TABLE ai_usage_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read ai_usage_summary" ON ai_usage_summary;
CREATE POLICY "Admin read ai_usage_summary" ON ai_usage_summary
  FOR SELECT TO authenticated
  USING (true);

-- ==========================================
-- 5. Chat Feedback Table (for quality monitoring)
-- ==========================================
CREATE TABLE IF NOT EXISTS chat_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES report_chat_conversations(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT CHECK (feedback_type IN ('helpful', 'not_helpful', 'inaccurate', 'offensive', 'other')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for chat_feedback
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert chat_feedback" ON chat_feedback;
CREATE POLICY "Public insert chat_feedback" ON chat_feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read chat_feedback" ON chat_feedback;
CREATE POLICY "Admin read chat_feedback" ON chat_feedback
  FOR SELECT TO authenticated
  USING (true);

-- ==========================================
-- 6. Prompt Templates Table
-- ==========================================
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 500,
  is_default BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for prompt_templates
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access prompt_templates" ON prompt_templates;
CREATE POLICY "Admin full access prompt_templates" ON prompt_templates
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ==========================================
-- 7. Indexes for Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session 
  ON report_chat_conversations(session_id);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_created 
  ON report_chat_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_report 
  ON report_chat_conversations(report_id);

CREATE INDEX IF NOT EXISTS idx_ai_usage_summary_date 
  ON ai_usage_summary(date DESC);

CREATE INDEX IF NOT EXISTS idx_chat_feedback_session 
  ON chat_feedback(session_id);

-- ==========================================
-- 8. Helper Functions
-- ==========================================

-- Function to calculate cost
CREATE OR REPLACE FUNCTION calculate_ai_cost(
  p_model TEXT,
  p_prompt_tokens INTEGER,
  p_completion_tokens INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  v_input_price DECIMAL;
  v_output_price DECIMAL;
BEGIN
  -- Prices per 1M tokens (December 2024)
  CASE p_model
    WHEN 'gpt-4o' THEN
      v_input_price := 2.50;
      v_output_price := 10.00;
    WHEN 'gpt-4o-mini' THEN
      v_input_price := 0.15;
      v_output_price := 0.60;
    WHEN 'gpt-4-turbo' THEN
      v_input_price := 10.00;
      v_output_price := 30.00;
    WHEN 'gpt-3.5-turbo' THEN
      v_input_price := 0.50;
      v_output_price := 1.50;
    ELSE
      v_input_price := 0.15;
      v_output_price := 0.60;
  END CASE;

  RETURN (p_prompt_tokens * v_input_price + p_completion_tokens * v_output_price) / 1000000;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 9. Views for Dashboard
-- ==========================================

-- Daily usage view
CREATE OR REPLACE VIEW v_daily_ai_usage AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(*) as messages,
  SUM(COALESCE(tokens_used, 0)) as total_tokens,
  COUNT(*) FILTER (WHERE role = 'user') as user_messages,
  COUNT(*) FILTER (WHERE role = 'assistant') as assistant_messages
FROM report_chat_conversations
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant access to view
GRANT SELECT ON v_daily_ai_usage TO authenticated;

COMMENT ON TABLE digibot_config IS 'DigiBot AI configuration settings';
COMMENT ON TABLE ai_budget_config IS 'Monthly AI budget and alert settings';
COMMENT ON TABLE ai_usage_summary IS 'Aggregated daily AI usage statistics';
COMMENT ON TABLE chat_feedback IS 'User feedback on AI responses';
COMMENT ON TABLE prompt_templates IS 'Saved prompt templates for testing';

-- Create digital_analysis_reports table for AI-powered company analysis
CREATE TABLE digital_analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company Information
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  linkedin_url TEXT,
  
  -- Analysis Results (from AI Agent)
  analysis_result JSONB, -- Stores AI-generated analysis data
  analysis_summary TEXT, -- Quick text summary
  digital_score INTEGER, -- Overall digital presence score (0-100)
  
  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN 
    ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Webhook & Processing Metadata
  webhook_request_id TEXT, -- n8n workflow execution ID
  webhook_triggered_at TIMESTAMPTZ,
  webhook_completed_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  error_message TEXT, -- Store error details if failed
  
  -- Admin Fields
  requested_by TEXT, -- Admin user who requested analysis
  admin_notes TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- PDF Export Tracking
  pdf_generated BOOLEAN DEFAULT false,
  pdf_generated_at TIMESTAMPTZ,
  pdf_download_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_analysis_reports_status ON digital_analysis_reports(status);
CREATE INDEX idx_analysis_reports_created ON digital_analysis_reports(created_at DESC);
CREATE INDEX idx_analysis_reports_company ON digital_analysis_reports(company_name);
CREATE INDEX idx_analysis_reports_webhook ON digital_analysis_reports(webhook_request_id);

-- Enable Row Level Security
ALTER TABLE digital_analysis_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy (permissive for admin panel)
CREATE POLICY "Digital analysis reports policy" ON digital_analysis_reports
  FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

-- Updated timestamp trigger (using existing moddatetime function)
CREATE TRIGGER handle_updated_at_analysis_reports
  BEFORE UPDATE ON digital_analysis_reports
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Activity log trigger for status changes
CREATE FUNCTION log_analysis_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO activity_log (entity_type, entity_id, action, old_value, new_value, description)
        VALUES (
            'digital_analysis',
            NEW.id,
            'status_change',
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            'Digital analysis report status changed from ' || OLD.status || ' to ' || NEW.status || ' for company: ' || NEW.company_name
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analysis_status_change_trigger
  AFTER UPDATE ON digital_analysis_reports
  FOR EACH ROW
  EXECUTE FUNCTION log_analysis_status_change();

-- Add view for dashboard stats
CREATE OR REPLACE VIEW digital_analysis_stats AS
SELECT 
  COUNT(*) as total_reports,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'processing') as processing_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  ROUND(AVG(digital_score)) as avg_digital_score,
  ROUND(AVG(processing_duration_ms)) as avg_processing_time_ms
FROM digital_analysis_reports;

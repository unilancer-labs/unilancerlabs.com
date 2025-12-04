-- Admin Panel Improvements - Phase 1
-- Adds admin_notes, activity_log, and project_assignments tables

-- ============================================
-- 1. Admin Notes Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('freelancer', 'project_request', 'contact', 'newsletter')),
    entity_id UUID NOT NULL,
    note_text TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);

-- Enable RLS
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Policy for admin access
CREATE POLICY "Admin can manage notes" ON admin_notes
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 2. Activity Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('freelancer', 'project_request', 'contact', 'newsletter')),
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    description TEXT,
    performed_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy for admin access
CREATE POLICY "Admin can view activity log" ON activity_log
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 3. Project Assignments Table
-- ============================================
CREATE TABLE IF NOT EXISTS project_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES freelancer_applications(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'developer',
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'removed')),
    notes TEXT,
    assigned_by TEXT DEFAULT 'admin',
    assigned_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, freelancer_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_project_assignments_project ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_freelancer ON project_assignments(freelancer_id);

-- Enable RLS
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;

-- Policy for admin access
CREATE POLICY "Admin can manage project assignments" ON project_assignments
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 4. Enhance freelancer_applications table
-- ============================================
DO $$ 
BEGIN
    -- Add interview_date if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'freelancer_applications' AND column_name = 'interview_date') THEN
        ALTER TABLE freelancer_applications ADD COLUMN interview_date TIMESTAMPTZ;
    END IF;
    
    -- Add rating if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'freelancer_applications' AND column_name = 'rating') THEN
        ALTER TABLE freelancer_applications ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5);
    END IF;
    
    -- Add admin_notes if not exists (quick notes field)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'freelancer_applications' AND column_name = 'admin_notes') THEN
        ALTER TABLE freelancer_applications ADD COLUMN admin_notes TEXT;
    END IF;
    
    -- Add last_contacted_at if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'freelancer_applications' AND column_name = 'last_contacted_at') THEN
        ALTER TABLE freelancer_applications ADD COLUMN last_contacted_at TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================
-- 5. Enhance project_requests table
-- ============================================
DO $$ 
BEGIN
    -- Add priority if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'project_requests' AND column_name = 'priority') THEN
        ALTER TABLE project_requests ADD COLUMN priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
    END IF;
    
    -- Add follow_up_date if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'project_requests' AND column_name = 'follow_up_date') THEN
        ALTER TABLE project_requests ADD COLUMN follow_up_date TIMESTAMPTZ;
    END IF;
    
    -- Add estimated_budget if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'project_requests' AND column_name = 'estimated_budget') THEN
        ALTER TABLE project_requests ADD COLUMN estimated_budget TEXT;
    END IF;
    
    -- Add admin_notes if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'project_requests' AND column_name = 'admin_notes') THEN
        ALTER TABLE project_requests ADD COLUMN admin_notes TEXT;
    END IF;
    
    -- Add assigned_to if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'project_requests' AND column_name = 'assigned_to') THEN
        ALTER TABLE project_requests ADD COLUMN assigned_to TEXT;
    END IF;
END $$;

-- ============================================
-- 6. Activity Log Trigger Functions
-- ============================================

-- Function to log freelancer status changes
CREATE OR REPLACE FUNCTION log_freelancer_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO activity_log (entity_type, entity_id, action, old_value, new_value, description)
        VALUES (
            'freelancer',
            NEW.id,
            'status_change',
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            'Freelancer status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for freelancer status changes
DROP TRIGGER IF EXISTS freelancer_status_change_trigger ON freelancer_applications;
CREATE TRIGGER freelancer_status_change_trigger
    AFTER UPDATE ON freelancer_applications
    FOR EACH ROW
    EXECUTE FUNCTION log_freelancer_status_change();

-- Function to log project request status changes
CREATE OR REPLACE FUNCTION log_project_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO activity_log (entity_type, entity_id, action, old_value, new_value, description)
        VALUES (
            'project_request',
            NEW.id,
            'status_change',
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            'Project status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for project status changes
DROP TRIGGER IF EXISTS project_status_change_trigger ON project_requests;
CREATE TRIGGER project_status_change_trigger
    AFTER UPDATE ON project_requests
    FOR EACH ROW
    EXECUTE FUNCTION log_project_status_change();

-- ============================================
-- 7. Helper Views for Dashboard
-- ============================================

-- Dashboard statistics view
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM freelancer_applications WHERE status = 'pending') as pending_freelancers,
    (SELECT COUNT(*) FROM freelancer_applications WHERE status = 'approved') as approved_freelancers,
    (SELECT COUNT(*) FROM freelancer_applications WHERE status = 'rejected') as rejected_freelancers,
    (SELECT COUNT(*) FROM freelancer_applications WHERE status = 'interview') as interview_freelancers,
    (SELECT COUNT(*) FROM freelancer_applications) as total_freelancers,
    (SELECT COUNT(*) FROM project_requests WHERE status = 'pending') as pending_projects,
    (SELECT COUNT(*) FROM project_requests WHERE status = 'in_progress') as in_progress_projects,
    (SELECT COUNT(*) FROM project_requests WHERE status = 'completed') as completed_projects,
    (SELECT COUNT(*) FROM project_requests) as total_projects,
    (SELECT COUNT(*) FROM contact_submissions WHERE created_at > now() - interval '7 days') as recent_contacts,
    (SELECT COUNT(*) FROM newsletter_subscriptions WHERE subscribed_at > now() - interval '7 days') as recent_subscribers;

-- Recent activity view
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    id,
    entity_type,
    entity_id,
    action,
    description,
    performed_by,
    created_at
FROM activity_log
ORDER BY created_at DESC
LIMIT 50;

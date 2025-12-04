import { supabase } from '../config/supabase';

// ============================================
// Admin Dashboard Stats
// ============================================
export interface DashboardStats {
  freelancers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    interview: number;
  };
  projects: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  contacts: {
    recentCount: number;
  };
  newsletters: {
    recentCount: number;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get freelancer stats
  const { data: freelancers } = await supabase
    .from('freelancer_applications')
    .select('status');

  // Get project stats
  const { data: projects } = await supabase
    .from('project_requests')
    .select('status');

  // Get recent contacts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: recentContacts } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  // Get recent newsletters (last 7 days)
  const { count: recentNewsletters } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .gte('subscribed_at', sevenDaysAgo.toISOString());

  return {
    freelancers: {
      total: freelancers?.length || 0,
      pending: freelancers?.filter(f => f.status === 'pending').length || 0,
      approved: freelancers?.filter(f => f.status === 'approved' || f.status === 'accepted').length || 0,
      rejected: freelancers?.filter(f => f.status === 'rejected').length || 0,
      interview: freelancers?.filter(f => f.status === 'interview' || f.status === 'reviewing').length || 0,
    },
    projects: {
      total: projects?.length || 0,
      pending: projects?.filter(p => p.status === 'pending').length || 0,
      inProgress: projects?.filter(p => p.status === 'in-progress' || p.status === 'reviewing').length || 0,
      completed: projects?.filter(p => p.status === 'completed').length || 0,
      cancelled: projects?.filter(p => p.status === 'cancelled').length || 0,
    },
    contacts: {
      recentCount: recentContacts || 0,
    },
    newsletters: {
      recentCount: recentNewsletters || 0,
    },
  };
}

// ============================================
// Admin Notes
// ============================================
export interface AdminNote {
  id: string;
  entity_type: 'freelancer' | 'project_request' | 'contact' | 'newsletter';
  entity_id: string;
  note_text: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function getAdminNotes(entityType: string, entityId: string): Promise<AdminNote[]> {
  const { data, error } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAdminNote(
  entityType: string, 
  entityId: string, 
  noteText: string,
  isPrivate: boolean = false
): Promise<AdminNote> {
  const { data, error } = await supabase
    .from('admin_notes')
    .insert([{
      entity_type: entityType,
      entity_id: entityId,
      note_text: noteText,
      is_private: isPrivate,
      created_by: 'admin',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from('admin_notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
}

// ============================================
// Activity Log
// ============================================
export interface ActivityLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_value: any;
  new_value: any;
  description: string;
  performed_by: string;
  created_at: string;
}

export async function getActivityLog(entityType?: string, entityId?: string): Promise<ActivityLogEntry[]> {
  let query = supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }
  if (entityId) {
    query = query.eq('entity_id', entityId);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Activity log error:', error);
    return [];
  }
  return data || [];
}

export async function logActivity(
  entityType: string,
  entityId: string,
  action: string,
  description: string,
  oldValue?: any,
  newValue?: any
): Promise<void> {
  const { error } = await supabase
    .from('activity_log')
    .insert([{
      entity_type: entityType,
      entity_id: entityId,
      action: action,
      description: description,
      old_value: oldValue,
      new_value: newValue,
      performed_by: 'admin',
    }]);

  if (error) {
    console.error('Failed to log activity:', error);
  }
}

// ============================================
// Project Assignments
// ============================================
export interface ProjectAssignment {
  id: string;
  project_id: string;
  freelancer_id: string;
  role: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'removed';
  notes: string | null;
  assigned_by: string;
  assigned_at: string;
  updated_at: string;
  // Joined data
  freelancer?: {
    id: string;
    full_name: string;
    email: string;
    main_expertise: string[];
  };
}

export async function getProjectAssignments(projectId: string): Promise<ProjectAssignment[]> {
  const { data, error } = await supabase
    .from('project_assignments')
    .select(`
      *,
      freelancer:freelancer_applications(id, full_name, email, main_expertise)
    `)
    .eq('project_id', projectId)
    .neq('status', 'removed')
    .order('assigned_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function assignFreelancerToProject(
  projectId: string,
  freelancerId: string,
  role: string = 'developer',
  notes?: string
): Promise<ProjectAssignment> {
  const { data, error } = await supabase
    .from('project_assignments')
    .insert([{
      project_id: projectId,
      freelancer_id: freelancerId,
      role: role,
      notes: notes,
      status: 'assigned',
    }])
    .select()
    .single();

  if (error) throw error;

  // Log activity
  await logActivity(
    'project_request',
    projectId,
    'freelancer_assigned',
    `Freelancer projeye atandı (Rol: ${role})`
  );

  return data;
}

export async function removeFreelancerFromProject(assignmentId: string): Promise<void> {
  const { error } = await supabase
    .from('project_assignments')
    .update({ status: 'removed' })
    .eq('id', assignmentId);

  if (error) throw error;
}

export async function updateAssignmentStatus(
  assignmentId: string, 
  status: ProjectAssignment['status']
): Promise<void> {
  const { error } = await supabase
    .from('project_assignments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', assignmentId);

  if (error) throw error;
}

// ============================================
// Enhanced Freelancer Operations
// ============================================
export async function updateFreelancerDetails(
  id: string,
  updates: {
    status?: string;
    admin_notes?: string;
    rating?: number;
    interview_date?: string;
    last_contacted_at?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('freelancer_applications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;

  // Log status change if applicable
  if (updates.status) {
    await logActivity(
      'freelancer',
      id,
      'status_updated',
      `Freelancer durumu güncellendi: ${updates.status}`
    );
  }
}

// ============================================
// Enhanced Project Operations
// ============================================
export async function updateProjectDetails(
  id: string,
  updates: {
    status?: string;
    admin_notes?: string;
    priority?: string;
    follow_up_date?: string;
    estimated_budget?: string;
    assigned_to?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('project_requests')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;

  // Log status change if applicable
  if (updates.status) {
    await logActivity(
      'project_request',
      id,
      'status_updated',
      `Proje durumu güncellendi: ${updates.status}`
    );
  }
}

// ============================================
// Get Recent Items for Dashboard
// ============================================
export async function getRecentFreelancers(limit: number = 5) {
  const { data, error } = await supabase
    .from('freelancer_applications')
    .select('id, full_name, email, main_expertise, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getRecentProjects(limit: number = 5) {
  const { data, error } = await supabase
    .from('project_requests')
    .select('id, company_name, contact_name, service_categories, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getRecentContacts(limit: number = 5) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, name, email, subject, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// Email Notifications
// ============================================
export async function sendStatusChangeEmail(
  type: 'freelancer' | 'project',
  entityId: string,
  newStatus: string,
  recipientEmail: string,
  recipientName: string
): Promise<void> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: type === 'freelancer' ? 'freelancer_status_update' : 'project_status_update',
          record: {
            id: entityId,
            email: recipientEmail,
            name: recipientName,
            status: newStatus,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Email send failed:', await response.text());
    }
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

// ============================================
// Get Approved Freelancers for Assignment
// ============================================
export async function getApprovedFreelancers() {
  const { data, error } = await supabase
    .from('freelancer_applications')
    .select('id, full_name, email, main_expertise, location')
    .or('status.eq.approved,status.eq.accepted')
    .order('full_name');

  if (error) throw error;
  return data || [];
}

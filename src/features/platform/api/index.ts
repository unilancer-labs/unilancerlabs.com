import { supabase } from '../../../lib/config/supabase';
import { Job, JobApplication, Project, Profile, Skill, JobCategory, JobStatus } from '../types';

// =============================================
// JOBS API
// =============================================

export const jobsApi = {
  // Get all open jobs
  getOpenJobs: async (filters?: {
    category?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
    experienceLevel?: string;
    search?: string;
  }) => {
    let query = supabase
      .from('jobs')
      .select('*, employer:profiles(*)')
      .eq('status', 'open')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.skills?.length) {
      query = query.overlaps('required_skills', filters.skills);
    }
    if (filters?.budgetMin) {
      query = query.gte('budget_max', filters.budgetMin);
    }
    if (filters?.budgetMax) {
      query = query.lte('budget_min', filters.budgetMax);
    }
    if (filters?.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data: data as Job[], error };
  },

  // Get job by ID
  getJob: async (id: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:profiles(*)')
      .eq('id', id)
      .single();
    return { data: data as Job, error };
  },

  // Get employer's jobs
  getEmployerJobs: async (employerId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    return { data: data as Job[], error };
  },

  // Create job
  createJob: async (job: Partial<Job>) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    return { data: data as Job, error };
  },

  // Update job
  updateJob: async (id: string, updates: Partial<Job>) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Job, error };
  },

  // Delete job
  deleteJob: async (id: string) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Increment view count
  incrementViewCount: async (id: string) => {
    const { error } = await supabase.rpc('increment_job_views', { job_id: id });
    return { error };
  },
};

// =============================================
// APPLICATIONS API
// =============================================

export const applicationsApi = {
  // Apply to job
  apply: async (application: Partial<JobApplication>) => {
    const { data, error } = await supabase
      .from('job_applications')
      .insert(application)
      .select('*, job:jobs(*)')
      .single();
    
    // Update application count
    if (!error && application.job_id) {
      await supabase.rpc('increment_application_count', { job_id: application.job_id });
    }
    
    return { data: data as JobApplication, error };
  },

  // Get freelancer's applications
  getFreelancerApplications: async (freelancerId: string) => {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job:jobs(*, employer:profiles(*))')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    return { data: data as JobApplication[], error };
  },

  // Get applications for a job
  getJobApplications: async (jobId: string) => {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, freelancer:profiles(*)')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    return { data: data as JobApplication[], error };
  },

  // Update application status
  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    return { data: data as JobApplication, error };
  },

  // Withdraw application
  withdraw: async (id: string) => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: 'withdrawn' })
      .eq('id', id);
    return { error };
  },
};

// =============================================
// PROJECTS API
// =============================================

export const projectsApi = {
  // Get freelancer's projects
  getFreelancerProjects: async (freelancerId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, employer:profiles(*)')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    return { data: data as Project[], error };
  },

  // Get employer's projects
  getEmployerProjects: async (employerId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, freelancer:profiles(*)')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    return { data: data as Project[], error };
  },

  // Get project by ID
  getProject: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, employer:profiles(*), freelancer:profiles(*)')
      .eq('id', id)
      .single();
    return { data: data as Project, error };
  },

  // Create project from accepted application
  createFromApplication: async (applicationId: string, employerId: string) => {
    const { data: app } = await supabase
      .from('job_applications')
      .select('*, job:jobs(*)')
      .eq('id', applicationId)
      .single();
    
    if (!app) return { data: null, error: new Error('Application not found') };
    
    const project: Partial<Project> = {
      job_id: app.job_id,
      employer_id: employerId,
      freelancer_id: app.freelancer_id,
      title: app.job.title,
      agreed_budget: app.proposed_budget || app.job.budget_max,
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    // Update job and application status
    if (!error) {
      await applicationsApi.updateStatus(applicationId, 'accepted');
      await jobsApi.updateJob(app.job_id, { status: 'in_progress' as JobStatus });
    }
    
    return { data: data as Project, error };
  },

  // Update project
  updateProject: async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Project, error };
  },
};

// =============================================
// PROFILES API
// =============================================

export const profilesApi = {
  // Get freelancers
  getFreelancers: async (filters?: {
    skills?: string[];
    university?: string;
    search?: string;
  }) => {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'freelancer')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (filters?.skills?.length) {
      query = query.overlaps('skills', filters.skills);
    }
    if (filters?.university) {
      query = query.ilike('university', `%${filters.university}%`);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data: data as Profile[], error };
  },

  // Get profile by ID
  getProfile: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Profile, error };
  },
};

// =============================================
// REFERENCE DATA API
// =============================================

export const referenceApi = {
  // Get all skills
  getSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    return { data: data as Skill[], error };
  },

  // Get job categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .order('name', { ascending: true });
    return { data: data as JobCategory[], error };
  },
};

// =============================================
// MESSAGES API
// =============================================

export const messagesApi = {
  // Get conversations
  getConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Send message
  sendMessage: async (message: { sender_id: string; receiver_id: string; content: string; project_id?: string }) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    return { data, error };
  },

  // Mark as read
  markAsRead: async (messageIds: string[]) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .in('id', messageIds);
    return { error };
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);
    return { count: count ?? 0, error };
  },
};

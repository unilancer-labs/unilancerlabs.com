// =============================================
// UNILANCER PLATFORM - TYPE DEFINITIONS
// =============================================

export type UserType = 'freelancer' | 'employer' | 'admin';
export type JobStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type BudgetType = 'fixed' | 'hourly' | 'negotiable';
export type ExperienceLevel = 'entry' | 'intermediate' | 'expert';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  user_type: UserType;
  
  // Freelancer fields
  university: string | null;
  department: string | null;
  student_year: number | null;
  bio: string | null;
  skills: string[];
  hourly_rate: number | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
  
  // Employer fields
  company_name: string | null;
  company_website: string | null;
  company_linkedin: string | null;
  company_logo: string | null;
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '500+' | null;
  industry: string | null;
  company_description: string | null;
  
  // Status
  is_verified: boolean;
  is_active: boolean;
  total_projects: number;
  total_earnings: number;
  rating: number;
  review_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  short_description: string | null;
  category: string;
  required_skills: string[];
  budget_type: BudgetType;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  estimated_duration: string | null;
  deadline: string | null;
  experience_level: ExperienceLevel | null;
  status: JobStatus;
  view_count: number;
  application_count: number;
  is_featured: boolean;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  employer?: Profile;
}

export interface JobApplication {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string | null;
  proposed_budget: number | null;
  proposed_duration: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  job?: Job;
  freelancer?: Profile;
}

export interface Project {
  id: string;
  job_id: string | null;
  employer_id: string;
  freelancer_id: string;
  title: string;
  description: string | null;
  agreed_budget: number;
  currency: string;
  status: ProjectStatus;
  completion_percentage: number;
  start_date: string;
  expected_end_date: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  employer?: Profile;
  freelancer?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  project_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  
  // Joined fields
  sender?: Profile;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

// Auth Types
export interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  full_name: string;
  user_type: 'freelancer' | 'employer';
  // Freelancer specific
  university?: string;
  department?: string;
  // Employer specific
  company_name?: string;
}

// Dashboard Stats
export interface FreelancerStats {
  activeApplications: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  avgRating: number;
  unreadMessages: number;
}

export interface EmployerStats {
  openJobs: number;
  totalApplications: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  unreadMessages: number;
}

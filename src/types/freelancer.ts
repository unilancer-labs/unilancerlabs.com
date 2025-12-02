export interface Freelancer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location_type: 'turkey' | 'international';
  location: string;
  work_preference: 'remote' | 'hybrid';
  main_expertise: string[];
  sub_expertise: string[];
  tools_and_technologies: string[];
  education_status: string;
  university: string;
  work_status: string;
  about_text: string;
  cv_url?: string;
  portfolio_url?: string;
  portfolio_links: Array<{
    title: string;
    url: string;
  }>;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Alias for backwards compatibility
export type FreelancerApplication = Freelancer;
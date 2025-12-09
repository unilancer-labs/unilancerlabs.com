export interface DigitalAnalysisReport {
  id: string;
  
  // Company Information
  company_name: string;
  website_url: string;
  linkedin_url?: string;
  
  // Analysis Results
  analysis_result?: AnalysisResultData;
  analysis_summary?: string;
  digital_score?: number;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  
  // Webhook & Processing
  webhook_request_id?: string;
  webhook_triggered_at?: string;
  webhook_completed_at?: string;
  processing_duration_ms?: number;
  error_message?: string;
  
  // Admin Fields
  requested_by?: string;
  admin_notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // PDF Export
  pdf_generated: boolean;
  pdf_generated_at?: string;
  pdf_download_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface AnalysisResultData {
  // Executive Summary
  executive_summary?: string;
  
  // Digital Presence Scores
  scores?: {
    overall?: number;
    website?: number;
    seo?: number;
    social_media?: number;
    content_quality?: number;
    user_experience?: number;
    mobile_optimization?: number;
    performance?: number;
    security?: number;
  };
  
  // Website Analysis
  website_analysis?: {
    technology_stack?: string[];
    page_speed_score?: number;
    mobile_friendly?: boolean;
    ssl_enabled?: boolean;
    responsive_design?: boolean;
    meta_tags_quality?: string;
    content_length?: number;
    images_optimized?: boolean;
  };
  
  // SEO Analysis
  seo_analysis?: {
    title_tag?: string;
    meta_description?: string;
    h1_tags?: string[];
    keyword_density?: Record<string, number>;
    internal_links?: number;
    external_links?: number;
    alt_texts_present?: boolean;
    structured_data?: boolean;
  };
  
  // Social Media Presence
  social_media?: {
    linkedin?: {
      followers?: number;
      posts_per_week?: number;
      engagement_rate?: number;
      profile_completeness?: number;
    };
    facebook?: {
      url?: string;
      followers?: number;
    };
    twitter?: {
      url?: string;
      followers?: number;
    };
    instagram?: {
      url?: string;
      followers?: number;
    };
  };
  
  // Recommendations
  recommendations?: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact?: string;
    effort?: string;
  }>;
  
  // Competitive Analysis
  competitive_analysis?: {
    industry_average_score?: number;
    position?: string;
    strengths?: string[];
    weaknesses?: string[];
  };
  
  // Additional Insights
  insights?: Array<{
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
  }>;
  
  // Custom fields from AI
  [key: string]: any;
}

export interface CreateAnalysisRequest {
  company_name: string;
  website_url: string;
  linkedin_url?: string;
  requested_by?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateAnalysisRequest {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  analysis_result?: AnalysisResultData;
  analysis_summary?: string;
  digital_score?: number;
  webhook_request_id?: string;
  webhook_completed_at?: string;
  processing_duration_ms?: number;
  error_message?: string;
  admin_notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AnalysisFilters {
  status?: string;
  priority?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

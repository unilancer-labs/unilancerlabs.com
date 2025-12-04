export interface BlogCategory {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  description_en?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  post_count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  category_id?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  published: boolean;
  read_time: string;
  created_at: string;
  updated_at: string;
  // SEO fields
  meta_title?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_en?: string;
  focus_keyword?: string;
  og_image_alt?: string;
  canonical_url?: string;
  noindex?: boolean;
  // Joined
  category_data?: BlogCategory;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  categories: Set<string>;
}
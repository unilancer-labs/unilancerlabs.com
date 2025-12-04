import { supabase } from '../config/supabase';

// Types
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
  created_at: string;
  updated_at: string;
}

export interface BlogPostSEO {
  meta_title?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_en?: string;
  focus_keyword?: string;
  og_image_alt?: string;
  canonical_url?: string;
  noindex?: boolean;
}

export interface BlogPostWithSEO {
  id: string;
  title: string;
  title_en?: string;
  slug: string;
  slug_en?: string;
  excerpt: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  image_url?: string;
  category?: string;
  category_id?: string;
  tags: string[];
  author_id: string;
  read_time?: string;
  published: boolean;
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
  // Joined fields
  category_data?: BlogCategory;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface PaginatedBlogResponse {
  posts: BlogPostWithSEO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ========== CATEGORY FUNCTIONS ==========

export async function getCategories(activeOnly = false): Promise<BlogCategory[]> {
  let query = supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching category:', error);
    throw error;
  }

  return data;
}

export async function createCategory(category: Partial<BlogCategory>): Promise<BlogCategory> {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
}

export async function updateCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory> {
  const { data, error } = await supabase
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index + 1
  }));

  for (const update of updates) {
    const { error } = await supabase
      .from('blog_categories')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id);

    if (error) {
      console.error('Error reordering categories:', error);
      throw error;
    }
  }
}

// ========== BLOG POST FUNCTIONS (with SEO) ==========

export async function getBlogPosts(options: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  categoryId?: string;
  published?: boolean;
  search?: string;
  tag?: string;
}): Promise<PaginatedBlogResponse> {
  const {
    page = 1,
    limit = 9,
    categorySlug,
    categoryId,
    published = true,
    search,
    tag
  } = options;

  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category_data:blog_categories(*),
      author:team_members(id, name, avatar_url)
    `, { count: 'exact' });

  // Filters
  if (published !== undefined) {
    query = query.eq('published', published);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (categorySlug) {
    // First get category ID from slug
    const category = await getCategoryBySlug(categorySlug);
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // Pagination & ordering
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithSEO | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category_data:blog_categories(*),
      author:team_members(id, name, avatar_url)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching blog post:', error);
    throw error;
  }

  return data;
}

export async function getRelatedPosts(postId: string, categoryId?: string, limit = 3): Promise<BlogPostWithSEO[]> {
  let query = supabase
    .from('blog_posts')
    .select(`
      id, title, title_en, slug, slug_en, excerpt, excerpt_en, image_url, created_at, read_time,
      category_data:blog_categories(name, name_en, slug, color)
    `)
    .eq('published', true)
    .neq('id', postId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data || [];
}

export async function createBlogPostWithSEO(post: Partial<BlogPostWithSEO>): Promise<BlogPostWithSEO> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select(`
      *,
      category_data:blog_categories(*),
      author:team_members(id, name, avatar_url)
    `)
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }

  return data;
}

export async function updateBlogPostWithSEO(id: string, updates: Partial<BlogPostWithSEO>): Promise<BlogPostWithSEO> {
  // Remove joined fields before update
  const { category_data, author, ...updateData } = updates;

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      category_data:blog_categories(*),
      author:team_members(id, name, avatar_url)
    `)
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }

  return data;
}

// ========== SEO HELPER FUNCTIONS ==========

export function generateMetaTitle(title: string, categoryName?: string): string {
  const suffix = ' | Unilancer Blog';
  const maxLength = 60 - suffix.length;
  
  let metaTitle = title;
  if (categoryName) {
    metaTitle = `${title} - ${categoryName}`;
  }
  
  if (metaTitle.length > maxLength) {
    metaTitle = metaTitle.substring(0, maxLength - 3) + '...';
  }
  
  return metaTitle + suffix;
}

export function generateMetaDescription(excerpt: string, maxLength = 155): string {
  if (excerpt.length <= maxLength) return excerpt;
  return excerpt.substring(0, maxLength - 3).trim() + '...';
}

export function generateCanonicalUrl(slug: string, lang = 'tr'): string {
  const baseUrl = 'https://unilancerlabs.com';
  return lang === 'tr' 
    ? `${baseUrl}/blog/${slug}` 
    : `${baseUrl}/en/blog/${slug}`;
}

// ========== STATS & ANALYTICS ==========

export async function getBlogStats(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  postsByCategory: { category: string; count: number }[];
}> {
  const [postsResult, categoriesResult] = await Promise.all([
    supabase.from('blog_posts').select('id, published', { count: 'exact' }),
    supabase.from('blog_categories').select('name, post_count')
  ]);

  const posts = postsResult.data || [];
  const categories = categoriesResult.data || [];

  return {
    totalPosts: postsResult.count || 0,
    publishedPosts: posts.filter(p => p.published).length,
    draftPosts: posts.filter(p => !p.published).length,
    totalCategories: categories.length,
    postsByCategory: categories.map(c => ({
      category: c.name,
      count: c.post_count
    }))
  };
}

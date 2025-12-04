-- Blog Categories Table (without icon field as requested)
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  name_en text,
  slug text NOT NULL UNIQUE,
  description text,
  description_en text,
  color text DEFAULT '#6366f1', -- Tailwind indigo-500 as default
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add SEO columns to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_title_en text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_description_en text,
ADD COLUMN IF NOT EXISTS focus_keyword text,
ADD COLUMN IF NOT EXISTS og_image_alt text,
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Create index for faster category lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON blog_categories(sort_order);

-- Enable RLS on blog_categories
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "blog_categories_select_policy"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "blog_categories_insert_policy"
  ON blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "blog_categories_update_policy"
  ON blog_categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "blog_categories_delete_policy"
  ON blog_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger for blog_categories
CREATE TRIGGER handle_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Function to update category post count
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update old category count (if changing category)
  IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE blog_categories 
      SET post_count = (SELECT COUNT(*) FROM blog_posts WHERE category_id = OLD.category_id AND published = true)
      WHERE id = OLD.category_id;
    END IF;
  END IF;
  
  -- Update new category count
  IF NEW.category_id IS NOT NULL THEN
    UPDATE blog_categories 
    SET post_count = (SELECT COUNT(*) FROM blog_posts WHERE category_id = NEW.category_id AND published = true)
    WHERE id = NEW.category_id;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE blog_categories 
    SET post_count = (SELECT COUNT(*) FROM blog_posts WHERE category_id = OLD.category_id AND published = true)
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for post count
DROP TRIGGER IF EXISTS update_category_count_on_insert ON blog_posts;
DROP TRIGGER IF EXISTS update_category_count_on_update ON blog_posts;
DROP TRIGGER IF EXISTS update_category_count_on_delete ON blog_posts;

CREATE TRIGGER update_category_count_on_insert
  AFTER INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_category_post_count();

CREATE TRIGGER update_category_count_on_update
  AFTER UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_category_post_count();

CREATE TRIGGER update_category_count_on_delete
  AFTER DELETE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_category_post_count();

-- Seed default categories (İş, Vergi, Freelance, etc.)
INSERT INTO blog_categories (name, name_en, slug, description, description_en, color, sort_order) VALUES
  ('İş Dünyası', 'Business World', 'is-dunyasi', 'İş dünyası, kariyer ve profesyonel gelişim hakkında yazılar', 'Articles about business world, career and professional development', '#3b82f6', 1),
  ('Vergi & Finans', 'Tax & Finance', 'vergi-finans', 'Vergi, muhasebe ve finansal konular hakkında rehberler', 'Guides about tax, accounting and financial topics', '#10b981', 2),
  ('Freelance Hayatı', 'Freelance Life', 'freelance-hayati', 'Freelancer olarak çalışma, müşteri yönetimi ve ipuçları', 'Working as a freelancer, client management and tips', '#f59e0b', 3),
  ('Teknoloji', 'Technology', 'teknoloji', 'Yazılım, donanım ve teknoloji trendleri', 'Software, hardware and technology trends', '#6366f1', 4),
  ('Tasarım', 'Design', 'tasarim', 'UI/UX, grafik tasarım ve yaratıcı süreçler', 'UI/UX, graphic design and creative processes', '#ec4899', 5),
  ('Yapay Zeka', 'Artificial Intelligence', 'yapay-zeka', 'AI, makine öğrenimi ve otomasyon', 'AI, machine learning and automation', '#8b5cf6', 6),
  ('Kariyer', 'Career', 'kariyer', 'Kariyer planlama, iş arama ve mülakat teknikleri', 'Career planning, job search and interview techniques', '#14b8a6', 7),
  ('Girişimcilik', 'Entrepreneurship', 'girisimcilik', 'Startup, girişimcilik ve iş kurma süreçleri', 'Startup, entrepreneurship and business setup processes', '#f97316', 8)
ON CONFLICT (slug) DO NOTHING;

-- Migrate existing category strings to category_id
DO $$
DECLARE
  cat_record RECORD;
BEGIN
  -- Map existing category strings to new category IDs
  FOR cat_record IN 
    SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category != ''
  LOOP
    -- Try to find matching category
    UPDATE blog_posts bp
    SET category_id = (
      SELECT id FROM blog_categories bc 
      WHERE LOWER(bc.name) = LOWER(cat_record.category) 
         OR LOWER(bc.name_en) = LOWER(cat_record.category)
      LIMIT 1
    )
    WHERE bp.category = cat_record.category AND bp.category_id IS NULL;
  END LOOP;
END $$;

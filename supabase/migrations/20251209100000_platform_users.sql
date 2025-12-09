-- =============================================
-- UNILANCER PLATFORM - DATABASE SCHEMA
-- =============================================

-- 1. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('freelancer', 'employer', 'admin')),
  
  -- Freelancer fields
  university TEXT,
  department TEXT,
  student_year INTEGER CHECK (student_year BETWEEN 1 AND 6),
  bio TEXT,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  cv_url TEXT,
  
  -- Employer fields
  company_name TEXT,
  company_website TEXT,
  company_linkedin TEXT,
  company_logo TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  industry TEXT,
  company_description TEXT,
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_projects INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- 2. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  required_skills TEXT[],
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly', 'negotiable')),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency TEXT DEFAULT 'TRY',
  estimated_duration TEXT,
  deadline TIMESTAMPTZ,
  experience_level TEXT CHECK (experience_level IN ('entry', 'intermediate', 'expert')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open jobs viewable" ON jobs FOR SELECT USING (status = 'open' OR employer_id = auth.uid());
CREATE POLICY "Employers manage own jobs" ON jobs FOR ALL USING (employer_id = auth.uid());

CREATE TRIGGER handle_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- 3. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_budget DECIMAL(10,2),
  proposed_duration TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, freelancer_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_freelancer ON job_applications(freelancer_id);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers view own apps" ON job_applications FOR SELECT USING (freelancer_id = auth.uid());
CREATE POLICY "Employers view job apps" ON job_applications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid()));
CREATE POLICY "Freelancers create apps" ON job_applications FOR INSERT WITH CHECK (freelancer_id = auth.uid());

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  employer_id UUID NOT NULL REFERENCES profiles(id),
  freelancer_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  agreed_budget DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'TRY',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  completion_percentage INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ DEFAULT now(),
  expected_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project participants view" ON projects FOR SELECT 
  USING (employer_id = auth.uid() OR freelancer_id = auth.uid());

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own messages" ON messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 6. SKILLS REFERENCE
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
);

INSERT INTO skills (name, category) VALUES
  ('React', 'Frontend'), ('Vue.js', 'Frontend'), ('Angular', 'Frontend'),
  ('Next.js', 'Frontend'), ('TypeScript', 'Frontend'), ('JavaScript', 'Frontend'),
  ('Node.js', 'Backend'), ('Python', 'Backend'), ('Java', 'Backend'),
  ('PostgreSQL', 'Database'), ('MongoDB', 'Database'),
  ('AWS', 'DevOps'), ('Docker', 'DevOps'),
  ('Figma', 'Design'), ('UI/UX Design', 'Design'),
  ('SEO', 'Marketing'), ('Social Media', 'Marketing'),
  ('Video Editing', 'Media'), ('3D Modeling', 'Media'),
  ('Mobile (React Native)', 'Mobile'), ('Mobile (Flutter)', 'Mobile')
ON CONFLICT (name) DO NOTHING;

-- 7. JOB CATEGORIES
CREATE TABLE IF NOT EXISTS job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO job_categories (name, slug, description) VALUES
  ('Web Geliştirme', 'web-development', 'Frontend, Backend, Full-stack'),
  ('Mobil Uygulama', 'mobile-app', 'iOS, Android, Cross-platform'),
  ('UI/UX Tasarım', 'ui-ux-design', 'Arayüz ve deneyim tasarımı'),
  ('Grafik Tasarım', 'graphic-design', 'Logo, afiş, görseller'),
  ('Dijital Pazarlama', 'digital-marketing', 'SEO, SEM, sosyal medya'),
  ('İçerik Yazarlığı', 'content-writing', 'Blog, makale, copywriting'),
  ('Video & Animasyon', 'video-animation', 'Video düzenleme, motion graphics'),
  ('Veri Analizi', 'data-analysis', 'Veri analizi, raporlama')
ON CONFLICT (slug) DO NOTHING;

-- 8. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, user_type, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'freelancer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

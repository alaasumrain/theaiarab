-- Add AI-specific columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tool_type TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('مبتدئ', 'متوسط', 'متقدم')),
ADD COLUMN IF NOT EXISTS language_support TEXT[],
ADD COLUMN IF NOT EXISTS tutorial_url TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pricing_model TEXT,
ADD COLUMN IF NOT EXISTS arabic_name TEXT,
ADD COLUMN IF NOT EXISTS arabic_description TEXT;

-- Create tutorials table
CREATE TABLE IF NOT EXISTS public.tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT,
  content TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('مبتدئ', 'متوسط', 'متقدم')),
  category TEXT NOT NULL,
  author_id UUID,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tutorials_pkey PRIMARY KEY (id),
  CONSTRAINT tutorials_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users (id)
);

-- Create AI news table
CREATE TABLE IF NOT EXISTS public.ai_news (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT,
  summary_ar TEXT NOT NULL,
  summary_en TEXT,
  content_ar TEXT,
  content_en TEXT,
  source_url TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  published_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ai_news_pkey PRIMARY KEY (id)
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT user_favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id),
  CONSTRAINT user_favorites_unique UNIQUE (user_id, product_id)
);

-- Create user reviews table
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_ar TEXT,
  review_en TEXT,
  created_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT user_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT user_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id),
  CONSTRAINT user_reviews_unique UNIQUE (user_id, product_id)
);

-- Enable RLS on new tables
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for tutorials
CREATE POLICY "Public can view tutorials" ON public.tutorials FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tutorials" ON public.tutorials FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own tutorials" ON public.tutorials FOR UPDATE
  USING (auth.uid() = author_id);

-- Policies for AI news (admin only for insert/update)
CREATE POLICY "Public can view ai_news" ON public.ai_news FOR SELECT
  USING (true);

-- Policies for user favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for user reviews
CREATE POLICY "Public can view reviews" ON public.user_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can add reviews" ON public.user_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.user_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_tutorials_category ON public.tutorials (category);
CREATE INDEX idx_tutorials_difficulty ON public.tutorials (difficulty);
CREATE INDEX idx_ai_news_category ON public.ai_news (category);
CREATE INDEX idx_ai_news_tags ON public.ai_news USING GIN (tags);
CREATE INDEX idx_products_tool_type ON public.products (tool_type);
CREATE INDEX idx_products_difficulty_level ON public.products (difficulty_level);
CREATE INDEX idx_products_is_free ON public.products (is_free);
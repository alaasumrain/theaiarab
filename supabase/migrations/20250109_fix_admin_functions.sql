-- Fix admin functions and update schema for admin panel compatibility

-- Create the missing check_is_admin() function
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_is_admin() TO authenticated;

-- Add missing is_active column to newsletter_subscribers
-- This replaces the confirmed/unsubscribed_at pattern with a simple boolean
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing records to set is_active based on confirmed status
UPDATE newsletter_subscribers 
SET is_active = (confirmed = true AND unsubscribed_at IS NULL)
WHERE is_active IS NULL;

-- Add missing user_id column to newsletter_subscribers for linking to users
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_user_id ON newsletter_subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);

-- Add is_featured column to product_reviews table
ALTER TABLE product_reviews 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for is_featured
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_featured ON product_reviews(is_featured);

-- Create user_reviews table if it doesn't exist (for authenticated user reviews)
CREATE TABLE IF NOT EXISTS user_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for user_reviews
CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_product_id ON user_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_rating ON user_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_user_reviews_is_featured ON user_reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_reviews_created_at ON user_reviews(created_at);

-- Prevent duplicate reviews from same user for same product
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reviews_unique_user_product 
    ON user_reviews(user_id, product_id);

-- Enable RLS for user_reviews
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_reviews
CREATE POLICY "Anyone can view user reviews" ON user_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON user_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON user_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON user_reviews
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user reviews" ON user_reviews
    FOR ALL USING (check_is_admin());

-- Add updated_at trigger for user_reviews
CREATE TRIGGER user_reviews_updated_at
    BEFORE UPDATE ON user_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fix the product_reviews table to use proper column names
-- Rename user_name to reviewer_name if needed (check existing schema first)
DO $$ 
BEGIN
    -- Check if reviewer_name column exists, if not rename user_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_reviews' AND column_name = 'reviewer_name') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'product_reviews' AND column_name = 'user_name') THEN
            ALTER TABLE product_reviews RENAME COLUMN user_name TO reviewer_name;
        ELSE
            ALTER TABLE product_reviews ADD COLUMN reviewer_name VARCHAR(100);
        END IF;
    END IF;
END $$;

-- Update RLS policies for admin access to newsletter_subscribers
DROP POLICY IF EXISTS "Admins can view all subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (check_is_admin());

-- Update RLS policies for admin access to product_reviews
CREATE POLICY "Admins can manage product reviews" ON product_reviews
    FOR ALL USING (check_is_admin());

-- Create helper functions for admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'total_products', (SELECT COUNT(*) FROM products),
        'pending_products', (SELECT COUNT(*) FROM products WHERE approved = false),
        'total_reviews', (SELECT COUNT(*) FROM product_reviews) + (SELECT COUNT(*) FROM user_reviews),
        'newsletter_subscribers', (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true),
        'admin_users', (SELECT COUNT(*) FROM users WHERE role = 'admin')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to admins only
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
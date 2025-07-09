-- Add user_id column to product_reviews table
ALTER TABLE product_reviews 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Drop the old unique constraint that was based on email
DROP INDEX IF EXISTS idx_product_reviews_unique_user_product;

-- Create new unique constraint based on user_id (for authenticated users)
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_unique_user_product_auth 
  ON product_reviews(product_id, user_id) WHERE user_id IS NOT NULL;

-- Keep the email-based unique constraint for any existing guest reviews
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_unique_user_product_guest 
  ON product_reviews(product_id, user_email) WHERE user_id IS NULL;

-- Update RLS policies to be more specific about authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can submit reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;

-- Create new policies for authenticated users
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit reviews" ON product_reviews
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON product_reviews
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON product_reviews
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to get user's review for a specific product
CREATE OR REPLACE FUNCTION get_user_review_for_product(product_uuid UUID, user_uuid UUID)
RETURNS TABLE(
  review_id UUID,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id as review_id,
    pr.rating,
    pr.comment,
    pr.created_at
  FROM product_reviews pr
  WHERE pr.product_id = product_uuid 
    AND pr.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_review_for_product(UUID, UUID) TO authenticated; 
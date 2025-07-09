-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  comment_ar TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_email ON product_reviews(user_email);

-- Prevent duplicate reviews from same user for same product
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_unique_user_product 
  ON product_reviews(product_id, user_email);

-- Enable RLS (Row Level Security)
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view reviews
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT USING (true);

-- Create policy to allow users to submit reviews
CREATE POLICY "Users can submit reviews" ON product_reviews
  FOR INSERT WITH CHECK (true);

-- Create policy to allow users to update their own reviews
CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate average rating for a product
CREATE OR REPLACE FUNCTION get_product_average_rating(product_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM product_reviews 
    WHERE product_id = product_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get review count for a product
CREATE OR REPLACE FUNCTION get_product_review_count(product_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM product_reviews 
    WHERE product_id = product_uuid
  );
END;
$$ LANGUAGE plpgsql;
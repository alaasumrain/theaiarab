-- Add featured column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- Update RLS policy to allow admins to update featured status
-- This is already covered by the admin policies we created earlier
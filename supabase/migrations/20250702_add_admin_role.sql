-- Add role field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM users WHERE id = user_id), false);
$$ LANGUAGE SQL SECURITY DEFINER;

-- Update RLS policies for products table to allow admin operations
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can update all products" ON products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete all products" ON products
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for admin activity logs
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view activity logs" ON admin_activity_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "System can insert activity logs" ON admin_activity_logs
  FOR INSERT WITH CHECK (true);

-- Function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity(
  action TEXT,
  entity_type TEXT,
  entity_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), action, entity_type, entity_id, details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on admin functions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_activity TO authenticated;

-- IMPORTANT: Set yourself as admin (replace with your actual user ID after running the migration)
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
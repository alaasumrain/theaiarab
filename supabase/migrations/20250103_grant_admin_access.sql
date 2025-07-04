-- Grant admin access to alaasumrain@outlook.com
-- This migration ensures the user has admin privileges

-- Insert or update the user with admin role
INSERT INTO public.users (email, role, full_name, created_at, updated_at)
VALUES (
  'alaasumrain@outlook.com',
  'admin',
  'Alaa Sumrain',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Also handle the case where the user might be in auth.users but not in public.users
-- This ensures any existing auth user gets admin privileges
UPDATE public.users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'alaasumrain@outlook.com';

-- Ensure the user is marked as admin if they exist in auth but not in users table
INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT 
  auth.users.id,
  auth.users.email,
  'admin',
  COALESCE(auth.users.raw_user_meta_data->>'full_name', 'Alaa Sumrain'),
  auth.users.created_at,
  NOW()
FROM auth.users
WHERE auth.users.email = 'alaasumrain@outlook.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE public.users.email = auth.users.email
  ); 
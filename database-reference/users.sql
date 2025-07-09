-- =============================================================================
-- USERS TABLE - User Profiles and Authentication
-- =============================================================================

-- Table Schema
-- Primary purpose: Store user profile data linked to Supabase Auth
-- RLS: Enabled | Size: 32 kB | Rows: ~3

-- Column Details:
-- id (uuid, PK, FK): References auth.users.id
-- full_name (text): User's display name
-- avatar_url (text): Profile picture URL
-- billing_address (jsonb): Address information
-- payment_method (jsonb): Payment details
-- created_at (timestamptz): Account creation time
-- role (text, default 'user'): 'user' or 'admin'

-- Foreign Key Relationships:
-- id -> auth.users.id (Supabase Auth)

-- =============================================================================
-- BASIC QUERIES
-- =============================================================================

-- Get all users
SELECT 
    id,
    full_name as "الاسم",
    role as "الدور",
    created_at as "تاريخ الانضمام"
FROM users 
ORDER BY created_at DESC;

-- Get admin users
SELECT * FROM users 
WHERE role = 'admin';

-- Get users with profile data
SELECT 
    full_name,
    avatar_url,
    role,
    created_at
FROM users 
WHERE full_name IS NOT NULL
ORDER BY created_at DESC;

-- User count by role
SELECT 
    role as "الدور",
    COUNT(*) as "العدد"
FROM users 
GROUP BY role;

-- =============================================================================
-- ADVANCED QUERIES
-- =============================================================================

-- Users with their product submissions
SELECT 
    u.full_name as "المستخدم",
    u.role as "الدور",
    COUNT(p.id) as "عدد الأدوات المرسلة",
    COUNT(CASE WHEN p.approved = true THEN 1 END) as "المقبولة"
FROM users u
LEFT JOIN products p ON u.id = p.user_id
GROUP BY u.id, u.full_name, u.role
ORDER BY COUNT(p.id) DESC;

-- Active users (with submissions)
SELECT 
    u.full_name as "المستخدم",
    u.created_at as "تاريخ الانضمام",
    COUNT(p.id) as "الأدوات المرسلة",
    MAX(p.created_at) as "آخر إرسال"
FROM users u
INNER JOIN products p ON u.id = p.user_id
GROUP BY u.id, u.full_name, u.created_at
ORDER BY MAX(p.created_at) DESC;

-- Users with favorites
SELECT 
    u.full_name as "المستخدم",
    COUNT(f.id) as "عدد المفضلات"
FROM users u
LEFT JOIN user_favorites f ON u.id = f.user_id
GROUP BY u.id, u.full_name
HAVING COUNT(f.id) > 0
ORDER BY COUNT(f.id) DESC;

-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- User registration trends (last 30 days)
SELECT 
    DATE(created_at) as "التاريخ",
    COUNT(*) as "مستخدمين جدد"
FROM users 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- User activity summary
SELECT 
    'إجمالي المستخدمين' as "الإحصائية",
    COUNT(*)::text as "العدد"
FROM users
UNION ALL
SELECT 
    'المشرفين' as "الإحصائية",
    COUNT(*)::text as "العدد"
FROM users WHERE role = 'admin'
UNION ALL
SELECT 
    'مستخدمين مع ملف شخصي' as "الإحصائية",
    COUNT(*)::text as "العدد"
FROM users WHERE full_name IS NOT NULL;

-- =============================================================================
-- ADMIN QUERIES
-- =============================================================================

-- Recent user registrations
SELECT 
    full_name as "الاسم",
    role as "الدور",
    created_at as "تاريخ التسجيل",
    EXTRACT(DAYS FROM NOW() - created_at) as "أيام مضت"
FROM users 
ORDER BY created_at DESC
LIMIT 10;

-- Users without profile info
SELECT 
    id,
    role,
    created_at
FROM users 
WHERE full_name IS NULL 
OR full_name = '';

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Update user role
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE id = 'user-uuid';

-- Update user profile
-- UPDATE users 
-- SET full_name = 'اسم المستخدم' 
-- WHERE id = 'user-uuid';

-- Users with billing info
SELECT 
    full_name,
    CASE 
        WHEN billing_address IS NOT NULL THEN 'نعم'
        ELSE 'لا'
    END as "لديه عنوان",
    CASE 
        WHEN payment_method IS NOT NULL THEN 'نعم'
        ELSE 'لا'
    END as "لديه طريقة دفع"
FROM users 
WHERE full_name IS NOT NULL; 
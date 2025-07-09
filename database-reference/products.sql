-- =============================================================================
-- PRODUCTS TABLE - Core AI Tools Data
-- =============================================================================

-- Table Schema
-- Primary purpose: Store AI tools and applications with bilingual support
-- RLS: Enabled | Size: 304 kB | Rows: ~23

-- Column Details:
-- id (uuid, PK): Unique identifier
-- created_at (timestamptz): Creation timestamp
-- full_name (text, NOT NULL): Tool creator's full name
-- email (text, NOT NULL): Contact email
-- twitter_handle (text, NOT NULL): Twitter/X handle
-- product_website (text, NOT NULL): Tool's website URL
-- codename (text, UNIQUE, NOT NULL): URL-friendly identifier/slug
-- punchline (text, NOT NULL): Short description/tagline
-- description (text, NOT NULL): Detailed description
-- logo_src (text): Logo image URL
-- user_id (uuid, FK): References auth.users.id
-- tags (text[]): Array of tags
-- view_count (int, default 0): Number of views
-- approved (boolean, default false): Admin approval status
-- featured (boolean, default false): Featured on homepage
-- labels (text[]): Additional categorization
-- categories (text): Main category
-- tool_type (text): Type of AI tool
-- difficulty_level (text): 'مبتدئ', 'متوسط', 'متقدم'
-- language_support (text[]): Supported languages
-- tutorial_url (text): Link to tutorial
-- is_free (boolean, default true): Free vs paid tool
-- pricing_model (text): Pricing structure
-- arabic_name (text): Arabic name
-- arabic_description (text): Arabic description

-- =============================================================================
-- BASIC QUERIES
-- =============================================================================

-- Get all approved products
SELECT * FROM products 
WHERE approved = true 
ORDER BY created_at DESC;

-- Get featured products
SELECT id, codename, full_name, punchline, logo_src, view_count
FROM products 
WHERE approved = true AND featured = true
ORDER BY view_count DESC;

-- Get products by category
SELECT * FROM products 
WHERE approved = true 
AND categories = 'محركات البحث'
ORDER BY created_at DESC;

-- Get free tools only
SELECT * FROM products 
WHERE approved = true 
AND is_free = true
ORDER BY view_count DESC;

-- =============================================================================
-- ADVANCED QUERIES
-- =============================================================================

-- Most popular tools (by views)
SELECT 
    codename,
    full_name as "اسم الأداة",
    punchline as "الوصف",
    view_count as "عدد المشاهدات",
    categories as "الفئة"
FROM products 
WHERE approved = true
ORDER BY view_count DESC
LIMIT 10;

-- Tools by difficulty level with counts
SELECT 
    difficulty_level as "مستوى الصعوبة",
    COUNT(*) as "عدد الأدوات",
    AVG(view_count) as "متوسط المشاهدات"
FROM products 
WHERE approved = true 
AND difficulty_level IS NOT NULL
GROUP BY difficulty_level
ORDER BY COUNT(*) DESC;

-- Recent submissions pending approval
SELECT 
    full_name as "المرسل",
    codename as "اسم الأداة", 
    email,
    created_at as "تاريخ الإرسال",
    categories as "الفئة"
FROM products 
WHERE approved = false
ORDER BY created_at DESC;

-- Tools with Arabic support
SELECT 
    codename,
    full_name,
    arabic_name,
    language_support
FROM products 
WHERE approved = true 
AND 'العربية' = ANY(language_support)
ORDER BY view_count DESC;

-- Category distribution
SELECT 
    categories as "الفئة",
    COUNT(*) as "عدد الأدوات",
    COUNT(CASE WHEN featured = true THEN 1 END) as "المميزة"
FROM products 
WHERE approved = true 
AND categories IS NOT NULL
GROUP BY categories
ORDER BY COUNT(*) DESC;

-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- Daily submission stats (last 30 days)
SELECT 
    DATE(created_at) as "التاريخ",
    COUNT(*) as "عدد الإرسالات",
    COUNT(CASE WHEN approved = true THEN 1 END) as "المقبولة"
FROM products 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- Top contributors
SELECT 
    full_name as "المساهم",
    email,
    COUNT(*) as "عدد الأدوات المرسلة",
    COUNT(CASE WHEN approved = true THEN 1 END) as "المقبولة"
FROM products
GROUP BY full_name, email
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- Tools needing review
SELECT 
    codename as "اسم الأداة",
    full_name as "المرسل",
    categories as "الفئة",
    created_at as "تاريخ الإرسال",
    EXTRACT(DAYS FROM NOW() - created_at) as "أيام الانتظار"
FROM products 
WHERE approved = false
ORDER BY created_at ASC;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Find duplicate codenames
SELECT codename, COUNT(*) 
FROM products 
GROUP BY codename 
HAVING COUNT(*) > 1;

-- Products without logos
SELECT codename, full_name 
FROM products 
WHERE approved = true 
AND (logo_src IS NULL OR logo_src = '');

-- Update view count for a product
-- UPDATE products 
-- SET view_count = view_count + 1 
-- WHERE codename = 'tool-name';

-- Approve a product
-- UPDATE products 
-- SET approved = true 
-- WHERE id = 'product-uuid';

-- Feature a product
-- UPDATE products 
-- SET featured = true 
-- WHERE codename = 'tool-name' AND approved = true; 
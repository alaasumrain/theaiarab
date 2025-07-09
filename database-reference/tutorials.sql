-- =============================================================================
-- TUTORIALS TABLE - Educational Content (Bilingual)
-- =============================================================================

-- Table Schema
-- Primary purpose: Store educational tutorials with Arabic/English support
-- RLS: Enabled | Size: 144 kB | Rows: ~8

-- Column Details:
-- id (uuid, PK): Unique identifier
-- title_ar (text, NOT NULL): Arabic title
-- title_en (text): English title
-- content (text, NOT NULL): Tutorial content (markdown)
-- difficulty (text): 'مبتدئ', 'متوسط', 'متقدم'
-- category (text, NOT NULL): Tutorial category
-- author_id (uuid, FK): References auth.users.id
-- view_count (int, default 0): Number of views
-- created_at (timestamptz): Creation timestamp
-- updated_at (timestamptz): Last update timestamp

-- Foreign Key Relationships:
-- author_id -> auth.users.id

-- =============================================================================
-- BASIC QUERIES
-- =============================================================================

-- Get all tutorials
SELECT 
    id,
    title_ar as "العنوان بالعربية",
    title_en as "العنوان بالإنجليزية",
    category as "الفئة",
    difficulty as "المستوى",
    view_count as "المشاهدات",
    created_at as "تاريخ النشر"
FROM tutorials 
ORDER BY created_at DESC;

-- Get tutorials by category
SELECT * FROM tutorials 
WHERE category = 'تعلم الآلة'
ORDER BY view_count DESC;

-- Get tutorials by difficulty
SELECT 
    title_ar,
    category,
    view_count
FROM tutorials 
WHERE difficulty = 'مبتدئ'
ORDER BY view_count DESC;

-- Most popular tutorials
SELECT 
    title_ar as "العنوان",
    category as "الفئة",
    view_count as "المشاهدات"
FROM tutorials 
ORDER BY view_count DESC
LIMIT 10;

-- =============================================================================
-- ADVANCED QUERIES
-- =============================================================================

-- Tutorials with author info
SELECT 
    t.title_ar as "العنوان",
    t.category as "الفئة",
    u.full_name as "الكاتب",
    t.view_count as "المشاهدات",
    t.created_at as "تاريخ النشر"
FROM tutorials t
LEFT JOIN users u ON t.author_id = u.id
ORDER BY t.created_at DESC;

-- Category statistics
SELECT 
    category as "الفئة",
    COUNT(*) as "عدد الدروس",
    AVG(view_count) as "متوسط المشاهدات",
    SUM(view_count) as "إجمالي المشاهدات"
FROM tutorials 
GROUP BY category
ORDER BY COUNT(*) DESC;

-- Difficulty level distribution
SELECT 
    difficulty as "المستوى",
    COUNT(*) as "عدد الدروس",
    AVG(view_count) as "متوسط المشاهدات"
FROM tutorials 
WHERE difficulty IS NOT NULL
GROUP BY difficulty
ORDER BY 
    CASE difficulty
        WHEN 'مبتدئ' THEN 1
        WHEN 'متوسط' THEN 2
        WHEN 'متقدم' THEN 3
    END;

-- Recent tutorials
SELECT 
    title_ar as "العنوان",
    category as "الفئة",
    created_at as "تاريخ النشر",
    EXTRACT(DAYS FROM NOW() - created_at) as "أيام مضت"
FROM tutorials 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- Top performing tutorials
SELECT 
    title_ar as "العنوان",
    category as "الفئة",
    view_count as "المشاهدات",
    ROUND(view_count::decimal / EXTRACT(DAYS FROM NOW() - created_at + INTERVAL '1 day'), 2) as "مشاهدات يومية"
FROM tutorials 
WHERE created_at < NOW() - INTERVAL '1 day'
ORDER BY view_count DESC
LIMIT 10;

-- Content length analysis
SELECT 
    category as "الفئة",
    AVG(LENGTH(content)) as "متوسط طول المحتوى",
    MIN(LENGTH(content)) as "أقصر محتوى",
    MAX(LENGTH(content)) as "أطول محتوى"
FROM tutorials 
GROUP BY category
ORDER BY AVG(LENGTH(content)) DESC;

-- Publication timeline
SELECT 
    DATE_TRUNC('month', created_at) as "الشهر",
    COUNT(*) as "عدد الدروس المنشورة"
FROM tutorials 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC;

-- =============================================================================
-- CONTENT MANAGEMENT QUERIES
-- =============================================================================

-- Tutorials needing English translation
SELECT 
    title_ar as "العنوان بالعربية",
    category as "الفئة",
    created_at as "تاريخ النشر"
FROM tutorials 
WHERE title_en IS NULL OR title_en = ''
ORDER BY view_count DESC;

-- Author productivity
SELECT 
    u.full_name as "الكاتب",
    COUNT(t.id) as "عدد الدروس",
    SUM(t.view_count) as "إجمالي المشاهدات",
    AVG(t.view_count) as "متوسط المشاهدات"
FROM tutorials t
LEFT JOIN users u ON t.author_id = u.id
GROUP BY u.id, u.full_name
ORDER BY COUNT(t.id) DESC;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Update view count
-- UPDATE tutorials 
-- SET view_count = view_count + 1 
-- WHERE id = 'tutorial-uuid';

-- Update last modified
-- UPDATE tutorials 
-- SET updated_at = NOW() 
-- WHERE id = 'tutorial-uuid';

-- Find tutorials with long content
SELECT 
    title_ar,
    LENGTH(content) as "طول المحتوى",
    category
FROM tutorials 
WHERE LENGTH(content) > 10000
ORDER BY LENGTH(content) DESC; 
-- =============================================================================
-- AI_NEWS TABLE - News Articles (Bilingual)
-- =============================================================================

-- Table Schema
-- Primary purpose: Store AI news articles with Arabic/English support
-- RLS: Enabled | Size: 88 kB | Rows: ~3

-- Column Details:
-- id (uuid, PK): Unique identifier
-- title_ar (text, NOT NULL): Arabic title
-- title_en (text): English title
-- summary_ar (text, NOT NULL): Arabic summary
-- summary_en (text): English summary
-- content_ar (text): Full Arabic content
-- content_en (text): Full English content
-- source_url (text): Original article URL
-- image_url (text): Featured image URL
-- category (text): News category
-- tags (text[]): Article tags array
-- published_at (timestamptz): Publication date
-- created_at (timestamptz): Record creation time
-- summary (text): Legacy summary field
-- author (text): Article author
-- view_count (int, default 0): Number of views
-- is_featured (boolean, default false): Featured on homepage
-- is_published (boolean, default true): Publication status
-- updated_at (timestamptz): Last update time

-- =============================================================================
-- BASIC QUERIES
-- =============================================================================

-- Get all published news
SELECT 
    id,
    title_ar as "العنوان",
    summary_ar as "الملخص",
    author as "الكاتب",
    published_at as "تاريخ النشر",
    view_count as "المشاهدات"
FROM ai_news 
WHERE is_published = true
ORDER BY published_at DESC;

-- Get featured news
SELECT 
    title_ar as "العنوان",
    summary_ar as "الملخص",
    image_url,
    view_count as "المشاهدات"
FROM ai_news 
WHERE is_published = true AND is_featured = true
ORDER BY published_at DESC;

-- Get news by category
SELECT * FROM ai_news 
WHERE is_published = true 
AND category = 'تطوير الأدوات'
ORDER BY published_at DESC;

-- Recent news (last 7 days)
SELECT 
    title_ar as "العنوان",
    summary_ar as "الملخص",
    published_at as "تاريخ النشر"
FROM ai_news 
WHERE is_published = true 
AND published_at >= NOW() - INTERVAL '7 days'
ORDER BY published_at DESC;

-- =============================================================================
-- ADVANCED QUERIES
-- =============================================================================

-- Most popular news articles
SELECT 
    title_ar as "العنوان",
    category as "الفئة",
    view_count as "المشاهدات",
    published_at as "تاريخ النشر"
FROM ai_news 
WHERE is_published = true
ORDER BY view_count DESC
LIMIT 10;

-- News with high engagement (views per day)
SELECT 
    title_ar as "العنوان",
    view_count as "المشاهدات",
    ROUND(view_count::decimal / EXTRACT(DAYS FROM NOW() - published_at + INTERVAL '1 day'), 2) as "مشاهدات يومية",
    published_at as "تاريخ النشر"
FROM ai_news 
WHERE is_published = true 
AND published_at < NOW() - INTERVAL '1 day'
ORDER BY view_count::decimal / EXTRACT(DAYS FROM NOW() - published_at + INTERVAL '1 day') DESC
LIMIT 10;

-- Category distribution
SELECT 
    category as "الفئة",
    COUNT(*) as "عدد الأخبار",
    AVG(view_count) as "متوسط المشاهدات",
    COUNT(CASE WHEN is_featured = true THEN 1 END) as "المميزة"
FROM ai_news 
WHERE is_published = true 
AND category IS NOT NULL
GROUP BY category
ORDER BY COUNT(*) DESC;

-- Tag analysis
SELECT 
    tag as "التاغ",
    COUNT(*) as "عدد الاستخدامات"
FROM ai_news, 
     UNNEST(tags) as tag
WHERE is_published = true
GROUP BY tag
ORDER BY COUNT(*) DESC
LIMIT 20;

-- =============================================================================
-- CONTENT ANALYSIS
-- =============================================================================

-- Articles needing translation
SELECT 
    title_ar as "العنوان العربي",
    CASE 
        WHEN title_en IS NULL OR title_en = '' THEN 'يحتاج ترجمة عنوان'
        WHEN content_en IS NULL OR content_en = '' THEN 'يحتاج ترجمة محتوى'
        ELSE 'مترجم'
    END as "حالة الترجمة",
    published_at as "تاريخ النشر"
FROM ai_news 
WHERE is_published = true
ORDER BY published_at DESC;

-- Content length analysis
SELECT 
    category as "الفئة",
    AVG(LENGTH(COALESCE(content_ar, ''))) as "متوسط طول المحتوى العربي",
    AVG(LENGTH(COALESCE(content_en, ''))) as "متوسط طول المحتوى الإنجليزي"
FROM ai_news 
WHERE is_published = true 
AND category IS NOT NULL
GROUP BY category;

-- Articles without images
SELECT 
    title_ar as "العنوان",
    category as "الفئة",
    published_at as "تاريخ النشر"
FROM ai_news 
WHERE is_published = true 
AND (image_url IS NULL OR image_url = '')
ORDER BY view_count DESC;

-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- Publishing timeline (monthly)
SELECT 
    DATE_TRUNC('month', published_at) as "الشهر",
    COUNT(*) as "عدد الأخبار المنشورة",
    AVG(view_count) as "متوسط المشاهدات"
FROM ai_news 
WHERE is_published = true
GROUP BY DATE_TRUNC('month', published_at)
ORDER BY DATE_TRUNC('month', published_at) DESC;

-- Author productivity
SELECT 
    author as "الكاتب",
    COUNT(*) as "عدد المقالات",
    SUM(view_count) as "إجمالي المشاهدات",
    AVG(view_count) as "متوسط المشاهدات"
FROM ai_news 
WHERE is_published = true 
AND author IS NOT NULL
GROUP BY author
ORDER BY COUNT(*) DESC;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Update view count
-- UPDATE ai_news 
-- SET view_count = view_count + 1 
-- WHERE id = 'news-uuid';

-- Feature an article
-- UPDATE ai_news 
-- SET is_featured = true 
-- WHERE id = 'news-uuid';

-- Publish/unpublish article
-- UPDATE ai_news 
-- SET is_published = false 
-- WHERE id = 'news-uuid';

-- Draft articles (unpublished)
SELECT 
    title_ar as "العنوان",
    author as "الكاتب",
    created_at as "تاريخ الإنشاء",
    EXTRACT(DAYS FROM NOW() - created_at) as "أيام في المسودة"
FROM ai_news 
WHERE is_published = false
ORDER BY created_at DESC; 
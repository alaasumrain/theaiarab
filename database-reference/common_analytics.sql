-- =============================================================================
-- COMMON ANALYTICS - Cross-Table Insights and Reports
-- =============================================================================

-- This file contains advanced analytics queries that combine multiple tables
-- for comprehensive insights and reporting across the entire platform.

-- =============================================================================
-- PLATFORM OVERVIEW DASHBOARD
-- =============================================================================

-- Complete platform statistics
SELECT 
    'إجمالي الأدوات' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM products WHERE approved = true
UNION ALL
SELECT 
    'الأدوات المميزة' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM products WHERE approved = true AND featured = true
UNION ALL
SELECT 
    'إجمالي المستخدمين' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM users
UNION ALL
SELECT 
    'الدروس التعليمية' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM tutorials
UNION ALL
SELECT 
    'الأخبار المنشورة' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM ai_news WHERE is_published = true
UNION ALL
SELECT 
    'مشتركي النشرة' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM newsletter_subscribers WHERE confirmed = true AND unsubscribed_at IS NULL;

-- =============================================================================
-- CONTENT PERFORMANCE ANALYSIS
-- =============================================================================

-- Top performing content across all types
WITH content_performance AS (
    SELECT 
        'أداة ذكية' as "نوع المحتوى",
        codename as "اسم المحتوى",
        view_count as "المشاهدات",
        created_at as "تاريخ النشر"
    FROM products WHERE approved = true
    
    UNION ALL
    
    SELECT 
        'درس تعليمي' as "نوع المحتوى",
        title_ar as "اسم المحتوى",
        view_count as "المشاهدات",
        created_at as "تاريخ النشر"
    FROM tutorials
    
    UNION ALL
    
    SELECT 
        'خبر تقني' as "نوع المحتوى",
        title_ar as "اسم المحتوى",
        view_count as "المشاهدات",
        published_at as "تاريخ النشر"
    FROM ai_news WHERE is_published = true
)
SELECT 
    "نوع المحتوى",
    "اسم المحتوى",
    "المشاهدات",
    "تاريخ النشر"
FROM content_performance
ORDER BY "المشاهدات" DESC
LIMIT 20;

-- Content engagement rates (views per day since publication)
WITH engagement_rates AS (
    SELECT 
        'أداة' as type,
        codename as name,
        view_count,
        EXTRACT(DAYS FROM NOW() - created_at + INTERVAL '1 day') as days_live,
        ROUND(view_count::decimal / EXTRACT(DAYS FROM NOW() - created_at + INTERVAL '1 day'), 2) as daily_views
    FROM products 
    WHERE approved = true AND created_at < NOW() - INTERVAL '1 day'
    
    UNION ALL
    
    SELECT 
        'درس' as type,
        title_ar as name,
        view_count,
        EXTRACT(DAYS FROM NOW() - created_at + INTERVAL '1 day') as days_live,
        ROUND(view_count::decimal / EXTRACT(DAYS FROM NOW() - created_at + INTERVAL '1 day'), 2) as daily_views
    FROM tutorials 
    WHERE created_at < NOW() - INTERVAL '1 day'
    
    UNION ALL
    
    SELECT 
        'خبر' as type,
        title_ar as name,
        view_count,
        EXTRACT(DAYS FROM NOW() - published_at + INTERVAL '1 day') as days_live,
        ROUND(view_count::decimal / EXTRACT(DAYS FROM NOW() - published_at + INTERVAL '1 day'), 2) as daily_views
    FROM ai_news 
    WHERE is_published = true AND published_at < NOW() - INTERVAL '1 day'
)
SELECT 
    type as "النوع",
    name as "الاسم",
    view_count as "إجمالي المشاهدات",
    daily_views as "مشاهدات يومية"
FROM engagement_rates
ORDER BY daily_views DESC
LIMIT 15;

-- =============================================================================
-- USER BEHAVIOR ANALYSIS
-- =============================================================================

-- User activity patterns
SELECT 
    u.full_name as "المستخدم",
    u.role as "الدور",
    COUNT(DISTINCT p.id) as "الأدوات المرسلة",
    COUNT(DISTINCT uf.id) as "المفضلات",
    COUNT(DISTINCT ur.id) as "المراجعات",
    COALESCE(SUM(p.view_count), 0) as "مشاهدات أدواته"
FROM users u
LEFT JOIN products p ON u.id = p.user_id AND p.approved = true
LEFT JOIN user_favorites uf ON u.id = uf.user_id
LEFT JOIN user_reviews ur ON u.id = ur.user_id
GROUP BY u.id, u.full_name, u.role
HAVING COUNT(DISTINCT p.id) > 0 OR COUNT(DISTINCT uf.id) > 0 OR COUNT(DISTINCT ur.id) > 0
ORDER BY (COUNT(DISTINCT p.id) + COUNT(DISTINCT uf.id) + COUNT(DISTINCT ur.id)) DESC;

-- Content interaction summary
SELECT 
    p.codename as "اسم الأداة",
    p.categories as "الفئة",
    p.view_count as "المشاهدات",
    COUNT(DISTINCT uf.id) as "المفضلات",
    COUNT(DISTINCT ur.id) as "مراجعات مصادقة",
    COUNT(DISTINCT pr.id) as "مراجعات عامة",
    ROUND(COALESCE(AVG(ur.rating), AVG(pr.rating)), 2) as "متوسط التقييم"
FROM products p
LEFT JOIN user_favorites uf ON p.id = uf.product_id
LEFT JOIN user_reviews ur ON p.id = ur.product_id
LEFT JOIN product_reviews pr ON p.id = pr.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename, p.categories, p.view_count
ORDER BY p.view_count DESC
LIMIT 20;

-- =============================================================================
-- TEMPORAL ANALYSIS
-- =============================================================================

-- Monthly content creation trends
SELECT 
    DATE_TRUNC('month', created_at) as "الشهر",
    COUNT(CASE WHEN table_name = 'products' THEN 1 END) as "أدوات جديدة",
    COUNT(CASE WHEN table_name = 'tutorials' THEN 1 END) as "دروس جديدة",
    COUNT(CASE WHEN table_name = 'ai_news' THEN 1 END) as "أخبار جديدة"
FROM (
    SELECT created_at, 'products' as table_name FROM products WHERE approved = true
    UNION ALL
    SELECT created_at, 'tutorials' as table_name FROM tutorials
    UNION ALL
    SELECT published_at as created_at, 'ai_news' as table_name FROM ai_news WHERE is_published = true
) combined_content
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY DATE_TRUNC('month', created_at) DESC;

-- Weekly activity patterns
SELECT 
    EXTRACT(DOW FROM activity_date) as day_of_week,
    CASE EXTRACT(DOW FROM activity_date)
        WHEN 0 THEN 'الأحد'
        WHEN 1 THEN 'الاثنين'
        WHEN 2 THEN 'الثلاثاء'
        WHEN 3 THEN 'الأربعاء'
        WHEN 4 THEN 'الخميس'
        WHEN 5 THEN 'الجمعة'
        WHEN 6 THEN 'السبت'
    END as "اليوم",
    COUNT(*) as "النشاطات"
FROM (
    SELECT created_at as activity_date FROM products WHERE approved = true
    UNION ALL
    SELECT created_at as activity_date FROM tutorials
    UNION ALL
    SELECT created_at as activity_date FROM user_favorites
    UNION ALL
    SELECT created_at as activity_date FROM user_reviews
) all_activities
WHERE activity_date >= NOW() - INTERVAL '30 days'
GROUP BY EXTRACT(DOW FROM activity_date)
ORDER BY day_of_week;

-- =============================================================================
-- QUALITY METRICS
-- =============================================================================

-- Content quality indicators
SELECT 
    'أدوات مع صور' as "المؤشر",
    CONCAT(
        ROUND(COUNT(CASE WHEN logo_src IS NOT NULL AND logo_src != '' THEN 1 END) * 100.0 / COUNT(*), 1),
        '% (',
        COUNT(CASE WHEN logo_src IS NOT NULL AND logo_src != '' THEN 1 END),
        '/',
        COUNT(*),
        ')'
    ) as "النسبة"
FROM products WHERE approved = true

UNION ALL

SELECT 
    'دروس مترجمة للإنجليزية' as "المؤشر",
    CONCAT(
        ROUND(COUNT(CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 1 END) * 100.0 / COUNT(*), 1),
        '% (',
        COUNT(CASE WHEN title_en IS NOT NULL AND title_en != '' THEN 1 END),
        '/',
        COUNT(*),
        ')'
    ) as "النسبة"
FROM tutorials

UNION ALL

SELECT 
    'أخبار مع صور' as "المؤشر",
    CONCAT(
        ROUND(COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) * 100.0 / COUNT(*), 1),
        '% (',
        COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END),
        '/',
        COUNT(*),
        ')'
    ) as "النسبة"
FROM ai_news WHERE is_published = true;

-- =============================================================================
-- ADMIN INSIGHTS
-- =============================================================================

-- Pending approvals summary
SELECT 
    'أدوات تحتاج موافقة' as "النوع",
    COUNT(*) as "العدد",
    MIN(created_at) as "الأقدم",
    MAX(created_at) as "الأحدث"
FROM products WHERE approved = false

UNION ALL

SELECT 
    'أخبار مسودة' as "النوع",
    COUNT(*) as "العدد",
    MIN(created_at) as "الأقدم",
    MAX(created_at) as "الأحدث"
FROM ai_news WHERE is_published = false;

-- Top contributors summary
SELECT 
    u.full_name as "المساهم",
    COUNT(DISTINCT p.id) as "أدوات مرسلة",
    COUNT(DISTINCT t.id) as "دروس مكتوبة",
    COUNT(DISTINCT ur.id) as "مراجعات كتبها",
    COALESCE(SUM(p.view_count), 0) + COALESCE(SUM(t.view_count), 0) as "إجمالي مشاهدات محتواه"
FROM users u
LEFT JOIN products p ON u.id = p.user_id AND p.approved = true
LEFT JOIN tutorials t ON u.id = t.author_id
LEFT JOIN user_reviews ur ON u.id = ur.user_id
GROUP BY u.id, u.full_name
HAVING COUNT(DISTINCT p.id) > 0 OR COUNT(DISTINCT t.id) > 0 OR COUNT(DISTINCT ur.id) > 0
ORDER BY (COALESCE(SUM(p.view_count), 0) + COALESCE(SUM(t.view_count), 0)) DESC
LIMIT 10;

-- =============================================================================
-- SEARCH AND DISCOVERY INSIGHTS
-- =============================================================================

-- Most searched categories/tags
WITH popular_terms AS (
    SELECT categories as term, COUNT(*) as views, 'فئة' as type
    FROM products 
    WHERE approved = true AND categories IS NOT NULL
    GROUP BY categories
    
    UNION ALL
    
    SELECT tag as term, SUM(view_count) as views, 'تاغ' as type
    FROM products, UNNEST(tags) as tag
    WHERE approved = true
    GROUP BY tag
)
SELECT 
    term as "المصطلح",
    type as "النوع",
    views as "المشاهدات الإجمالية"
FROM popular_terms
ORDER BY views DESC
LIMIT 20; 
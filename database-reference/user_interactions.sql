-- =============================================================================
-- USER INTERACTIONS - Favorites, Views, and Newsletter
-- =============================================================================

-- Tables tracking user interactions:
-- 1. user_favorites: User's favorite products
-- 2. product_views: Product view tracking
-- 3. newsletter_subscribers: Email newsletter subscriptions

-- =============================================================================
-- USER_FAVORITES TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- user_id (uuid, FK): References auth.users.id
-- product_id (uuid, FK): References products.id
-- created_at (timestamptz): When favorited

-- User's favorites
SELECT 
    u.full_name as "المستخدم",
    p.codename as "الأداة المفضلة",
    p.punchline as "الوصف",
    uf.created_at as "تاريخ الإضافة للمفضلة"
FROM user_favorites uf
LEFT JOIN users u ON uf.user_id = u.id
LEFT JOIN products p ON uf.product_id = p.id
ORDER BY uf.created_at DESC;

-- Most favorited products
SELECT 
    p.codename as "اسم الأداة",
    p.punchline as "الوصف",
    COUNT(uf.id) as "عدد المفضلات",
    p.view_count as "عدد المشاهدات"
FROM products p
LEFT JOIN user_favorites uf ON p.id = uf.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename, p.punchline, p.view_count
ORDER BY COUNT(uf.id) DESC
LIMIT 15;

-- Users with most favorites
SELECT 
    u.full_name as "المستخدم",
    COUNT(uf.id) as "عدد المفضلات",
    MIN(uf.created_at) as "أول مفضلة",
    MAX(uf.created_at) as "آخر مفضلة"
FROM users u
INNER JOIN user_favorites uf ON u.id = uf.user_id
GROUP BY u.id, u.full_name
ORDER BY COUNT(uf.id) DESC;

-- =============================================================================
-- PRODUCT_VIEWS TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- product_id (uuid, FK): References products.id
-- viewed_at (timestamptz): When viewed

-- Recent product views
SELECT 
    p.codename as "الأداة",
    pv.viewed_at as "وقت المشاهدة",
    EXTRACT(HOURS FROM NOW() - pv.viewed_at) as "ساعات مضت"
FROM product_views pv
LEFT JOIN products p ON pv.product_id = p.id
ORDER BY pv.viewed_at DESC
LIMIT 20;

-- Daily view statistics (last 7 days)
SELECT 
    DATE(pv.viewed_at) as "التاريخ",
    COUNT(*) as "عدد المشاهدات"
FROM product_views pv
WHERE pv.viewed_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(pv.viewed_at)
ORDER BY DATE(pv.viewed_at) DESC;

-- Most viewed products (from tracking table)
SELECT 
    p.codename as "اسم الأداة",
    COUNT(pv.id) as "المشاهدات المتتبعة",
    p.view_count as "عداد المشاهدات",
    MAX(pv.viewed_at) as "آخر مشاهدة"
FROM products p
LEFT JOIN product_views pv ON p.id = pv.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename, p.view_count
ORDER BY COUNT(pv.id) DESC
LIMIT 15;

-- =============================================================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- email (varchar, UNIQUE, NOT NULL): Subscriber email
-- subscribed_at (timestamptz): Subscription time
-- confirmed (boolean, default false): Email confirmation status
-- unsubscribed_at (timestamptz): Unsubscription time (if any)
-- created_at (timestamptz): Record creation time
-- updated_at (timestamptz): Last update time

-- All newsletter subscribers
SELECT 
    email as "البريد الإلكتروني",
    CASE 
        WHEN confirmed = true THEN 'مؤكد'
        ELSE 'غير مؤكد'
    END as "حالة التأكيد",
    subscribed_at as "تاريخ الاشتراك",
    CASE 
        WHEN unsubscribed_at IS NOT NULL THEN 'ملغي'
        ELSE 'نشط'
    END as "حالة الاشتراك"
FROM newsletter_subscribers
ORDER BY subscribed_at DESC;

-- Active confirmed subscribers
SELECT 
    COUNT(*) as "المشتركين النشطين المؤكدين"
FROM newsletter_subscribers
WHERE confirmed = true 
AND unsubscribed_at IS NULL;

-- Subscription statistics
SELECT 
    COUNT(*) as "إجمالي المشتركين",
    COUNT(CASE WHEN confirmed = true THEN 1 END) as "المؤكدين",
    COUNT(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 END) as "الملغيين",
    COUNT(CASE WHEN confirmed = true AND unsubscribed_at IS NULL THEN 1 END) as "النشطين"
FROM newsletter_subscribers;

-- Daily subscription trends (last 30 days)
SELECT 
    DATE(subscribed_at) as "التاريخ",
    COUNT(*) as "اشتراكات جديدة",
    COUNT(CASE WHEN confirmed = true THEN 1 END) as "مؤكدة"
FROM newsletter_subscribers
WHERE subscribed_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(subscribed_at)
ORDER BY DATE(subscribed_at) DESC;

-- =============================================================================
-- COMBINED ANALYTICS
-- =============================================================================

-- User engagement overview
SELECT 
    'مستخدمين مسجلين' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM users
UNION ALL
SELECT 
    'إجمالي المفضلات' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM user_favorites
UNION ALL
SELECT 
    'إجمالي المشاهدات المتتبعة' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM product_views
UNION ALL
SELECT 
    'مشتركي النشرة البريدية' as "المؤشر",
    COUNT(*)::text as "العدد"
FROM newsletter_subscribers
WHERE confirmed = true AND unsubscribed_at IS NULL;

-- Products by interaction type
SELECT 
    p.codename as "اسم الأداة",
    COUNT(DISTINCT uf.id) as "المفضلات",
    COUNT(DISTINCT pv.id) as "المشاهدات المتتبعة",
    p.view_count as "عداد المشاهدات"
FROM products p
LEFT JOIN user_favorites uf ON p.id = uf.product_id
LEFT JOIN product_views pv ON p.id = pv.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename, p.view_count
ORDER BY (COUNT(DISTINCT uf.id) + COUNT(DISTINCT pv.id)) DESC
LIMIT 20;

-- User activity levels
SELECT 
    u.full_name as "المستخدم",
    COUNT(DISTINCT uf.id) as "المفضلات",
    COUNT(DISTINCT p.id) as "الأدوات المرسلة",
    COALESCE(SUM(p.view_count), 0) as "مشاهدات أدواته"
FROM users u
LEFT JOIN user_favorites uf ON u.id = uf.user_id
LEFT JOIN products p ON u.id = p.user_id AND p.approved = true
GROUP BY u.id, u.full_name
HAVING COUNT(DISTINCT uf.id) > 0 OR COUNT(DISTINCT p.id) > 0
ORDER BY (COUNT(DISTINCT uf.id) + COUNT(DISTINCT p.id)) DESC;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Add to favorites
-- INSERT INTO user_favorites (user_id, product_id)
-- VALUES ('user-uuid', 'product-uuid');

-- Remove from favorites
-- DELETE FROM user_favorites 
-- WHERE user_id = 'user-uuid' AND product_id = 'product-uuid';

-- Track product view
-- INSERT INTO product_views (product_id)
-- VALUES ('product-uuid');

-- Subscribe to newsletter
-- INSERT INTO newsletter_subscribers (email)
-- VALUES ('user@example.com');

-- Confirm newsletter subscription
-- UPDATE newsletter_subscribers 
-- SET confirmed = true 
-- WHERE email = 'user@example.com';

-- Unsubscribe from newsletter
-- UPDATE newsletter_subscribers 
-- SET unsubscribed_at = NOW() 
-- WHERE email = 'user@example.com';

-- Clean old product views (keep last 30 days)
-- DELETE FROM product_views 
-- WHERE viewed_at < NOW() - INTERVAL '30 days'; 
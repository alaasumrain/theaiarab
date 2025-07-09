-- =============================================================================
-- REVIEWS AND RATINGS - Two Review Systems
-- =============================================================================

-- Two review tables:
-- 1. user_reviews: Authenticated user reviews (linked to auth)
-- 2. product_reviews: Public reviews (email-based, no auth required)

-- =============================================================================
-- USER_REVIEWS TABLE (Authenticated Reviews)
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- user_id (uuid, FK): References auth.users.id
-- product_id (uuid, FK): References products.id
-- rating (int): 1-5 star rating
-- review_ar (text): Arabic review text
-- review_en (text): English review text
-- created_at (timestamptz): Review creation time
-- updated_at (timestamptz): Last update time

-- =============================================================================
-- PRODUCT_REVIEWS TABLE (Public Reviews)
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- product_id (uuid, FK): References products.id
-- user_email (varchar, NOT NULL): Reviewer email
-- user_name (varchar): Reviewer name (optional)
-- rating (int, NOT NULL): 1-5 star rating
-- comment (text): English comment
-- comment_ar (text): Arabic comment
-- helpful_count (int, default 0): Helpfulness votes
-- created_at (timestamptz): Review creation time
-- updated_at (timestamptz): Last update time

-- =============================================================================
-- COMBINED REVIEW QUERIES
-- =============================================================================

-- All reviews for a product (both systems)
SELECT 
    'مصادق عليه' as "نوع المراجعة",
    u.full_name as "المراجع",
    ur.rating as "التقييم",
    COALESCE(ur.review_ar, ur.review_en) as "المراجعة",
    ur.created_at as "تاريخ المراجعة"
FROM user_reviews ur
LEFT JOIN users u ON ur.user_id = u.id
WHERE ur.product_id = 'product-uuid'

UNION ALL

SELECT 
    'عام' as "نوع المراجعة",
    COALESCE(pr.user_name, pr.user_email) as "المراجع",
    pr.rating as "التقييم",
    COALESCE(pr.comment_ar, pr.comment) as "المراجعة",
    pr.created_at as "تاريخ المراجعة"
FROM product_reviews pr
WHERE pr.product_id = 'product-uuid'

ORDER BY "تاريخ المراجعة" DESC;

-- Product rating statistics (combined)
WITH all_ratings AS (
    SELECT product_id, rating FROM user_reviews
    UNION ALL
    SELECT product_id, rating FROM product_reviews
)
SELECT 
    p.codename as "اسم الأداة",
    COUNT(ar.rating) as "عدد التقييمات",
    ROUND(AVG(ar.rating), 2) as "متوسط التقييم",
    COUNT(CASE WHEN ar.rating = 5 THEN 1 END) as "5 نجوم",
    COUNT(CASE WHEN ar.rating = 4 THEN 1 END) as "4 نجوم",
    COUNT(CASE WHEN ar.rating = 3 THEN 1 END) as "3 نجوم",
    COUNT(CASE WHEN ar.rating = 2 THEN 1 END) as "نجمتان",
    COUNT(CASE WHEN ar.rating = 1 THEN 1 END) as "نجمة واحدة"
FROM products p
LEFT JOIN all_ratings ar ON p.id = ar.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename
HAVING COUNT(ar.rating) > 0
ORDER BY AVG(ar.rating) DESC, COUNT(ar.rating) DESC;

-- =============================================================================
-- USER_REVIEWS SPECIFIC QUERIES
-- =============================================================================

-- Recent authenticated reviews
SELECT 
    u.full_name as "المستخدم",
    p.codename as "الأداة",
    ur.rating as "التقييم",
    ur.review_ar as "المراجعة",
    ur.created_at as "التاريخ"
FROM user_reviews ur
LEFT JOIN users u ON ur.user_id = u.id
LEFT JOIN products p ON ur.product_id = p.id
ORDER BY ur.created_at DESC
LIMIT 10;

-- User review activity
SELECT 
    u.full_name as "المستخدم",
    COUNT(ur.id) as "عدد المراجعات",
    AVG(ur.rating) as "متوسط التقييم المعطى",
    MIN(ur.created_at) as "أول مراجعة",
    MAX(ur.created_at) as "آخر مراجعة"
FROM users u
INNER JOIN user_reviews ur ON u.id = ur.user_id
GROUP BY u.id, u.full_name
ORDER BY COUNT(ur.id) DESC;

-- =============================================================================
-- PRODUCT_REVIEWS SPECIFIC QUERIES
-- =============================================================================

-- Recent public reviews
SELECT 
    COALESCE(pr.user_name, pr.user_email) as "المراجع",
    p.codename as "الأداة",
    pr.rating as "التقييم",
    COALESCE(pr.comment_ar, pr.comment) as "التعليق",
    pr.helpful_count as "تصويتات مفيدة",
    pr.created_at as "التاريخ"
FROM product_reviews pr
LEFT JOIN products p ON pr.product_id = p.id
ORDER BY pr.created_at DESC
LIMIT 10;

-- Most helpful reviews
SELECT 
    p.codename as "الأداة",
    COALESCE(pr.user_name, pr.user_email) as "المراجع",
    pr.rating as "التقييم",
    pr.helpful_count as "تصويتات مفيدة",
    SUBSTRING(COALESCE(pr.comment_ar, pr.comment), 1, 100) as "بداية التعليق"
FROM product_reviews pr
LEFT JOIN products p ON pr.product_id = p.id
WHERE pr.helpful_count > 0
ORDER BY pr.helpful_count DESC
LIMIT 10;

-- =============================================================================
-- ANALYTICS QUERIES
-- =============================================================================

-- Review system comparison
SELECT 
    'مراجعات مصادق عليها' as "النوع",
    COUNT(*) as "العدد",
    AVG(rating) as "متوسط التقييم"
FROM user_reviews
UNION ALL
SELECT 
    'مراجعات عامة' as "النوع",
    COUNT(*) as "العدد",
    AVG(rating) as "متوسط التقييم"
FROM product_reviews;

-- Daily review trends (last 30 days)
SELECT 
    DATE(created_at) as "التاريخ",
    COUNT(*) as "مراجعات مصادق عليها"
FROM user_reviews
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)

UNION ALL

SELECT 
    DATE(created_at) as "التاريخ",
    COUNT(*) as "مراجعات عامة"
FROM product_reviews
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)

ORDER BY "التاريخ" DESC;

-- Top rated products (minimum 3 reviews)
WITH combined_ratings AS (
    SELECT product_id, rating FROM user_reviews
    UNION ALL
    SELECT product_id, rating FROM product_reviews
)
SELECT 
    p.codename as "اسم الأداة",
    p.full_name as "المطور",
    COUNT(cr.rating) as "عدد التقييمات",
    ROUND(AVG(cr.rating), 2) as "متوسط التقييم"
FROM products p
INNER JOIN combined_ratings cr ON p.id = cr.product_id
WHERE p.approved = true
GROUP BY p.id, p.codename, p.full_name
HAVING COUNT(cr.rating) >= 3
ORDER BY AVG(cr.rating) DESC, COUNT(cr.rating) DESC
LIMIT 15;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Increment helpful count for public review
-- UPDATE product_reviews 
-- SET helpful_count = helpful_count + 1 
-- WHERE id = 'review-uuid';

-- Find duplicate reviews (same user, same product)
SELECT 
    user_id,
    product_id,
    COUNT(*) as "عدد المراجعات"
FROM user_reviews
GROUP BY user_id, product_id
HAVING COUNT(*) > 1; 
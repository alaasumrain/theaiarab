-- =============================================================================
-- QUICK REFERENCE - Essential Commands and Connection Info
-- =============================================================================

-- =============================================================================
-- DATABASE CONNECTION INFO
-- =============================================================================
-- Project ID: tarkomdsckzhhhkmeqpw
-- Database Host: db.tarkomdsckzhhhkmeqpw.supabase.co
-- Database Engine: PostgreSQL 15.8.1.105
-- Region: us-east-2
-- Status: ACTIVE_HEALTHY

-- =============================================================================
-- TABLE QUICK OVERVIEW
-- =============================================================================

-- Get table sizes and row counts
SELECT 
    schemaname,
    tablename as "Table",
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as "Size",
    n_live_tup as "Rows (Est)"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =============================================================================
-- MOST IMPORTANT QUERIES
-- =============================================================================

-- 1. Get all approved products (most common query)
SELECT codename, full_name, punchline, categories, view_count 
FROM products 
WHERE approved = true 
ORDER BY view_count DESC;

-- 2. Get featured content for homepage
SELECT 'product' as type, codename as slug, full_name as title, punchline as description, view_count
FROM products WHERE approved = true AND featured = true
UNION ALL
SELECT 'news' as type, id::text as slug, title_ar as title, summary_ar as description, view_count
FROM ai_news WHERE is_published = true AND is_featured = true
ORDER BY view_count DESC;

-- 3. Search products by category or tags
SELECT codename, full_name, punchline, categories, tags
FROM products 
WHERE approved = true 
AND (categories ILIKE '%search_term%' OR 'search_term' = ANY(tags))
ORDER BY view_count DESC;

-- 4. Get user's favorites
SELECT p.codename, p.full_name, p.punchline 
FROM products p
INNER JOIN user_favorites uf ON p.id = uf.product_id
WHERE uf.user_id = 'user-uuid'
ORDER BY uf.created_at DESC;

-- 5. Get product reviews and ratings
SELECT 
    COALESCE(ur.review_ar, pr.comment_ar, ur.review_en, pr.comment) as review_text,
    COALESCE(ur.rating, pr.rating) as rating,
    COALESCE(u.full_name, pr.user_name, pr.user_email) as reviewer_name,
    COALESCE(ur.created_at, pr.created_at) as review_date
FROM products p
LEFT JOIN user_reviews ur ON p.id = ur.product_id
LEFT JOIN users u ON ur.user_id = u.id
LEFT JOIN product_reviews pr ON p.id = pr.product_id
WHERE p.codename = 'tool-codename'
ORDER BY COALESCE(ur.created_at, pr.created_at) DESC;

-- =============================================================================
-- ADMIN QUICK COMMANDS
-- =============================================================================

-- Approve a product
UPDATE products SET approved = true WHERE codename = 'tool-name';

-- Feature a product
UPDATE products SET featured = true WHERE codename = 'tool-name' AND approved = true;

-- Get pending approvals
SELECT codename, full_name, email, created_at, categories
FROM products 
WHERE approved = false 
ORDER BY created_at ASC;

-- Make user admin
UPDATE users SET role = 'admin' WHERE id = 'user-uuid';

-- Get admin users
SELECT full_name, role, created_at FROM users WHERE role = 'admin';

-- =============================================================================
-- ANALYTICS QUICK QUERIES
-- =============================================================================

-- Platform summary
SELECT 
    (SELECT COUNT(*) FROM products WHERE approved = true) as approved_tools,
    (SELECT COUNT(*) FROM tutorials) as tutorials,
    (SELECT COUNT(*) FROM ai_news WHERE is_published = true) as published_news,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM newsletter_subscribers WHERE confirmed = true) as newsletter_subscribers;

-- Top 10 most viewed content
SELECT 'Product' as type, codename as name, view_count FROM products WHERE approved = true
UNION ALL
SELECT 'Tutorial' as type, title_ar as name, view_count FROM tutorials
UNION ALL
SELECT 'News' as type, title_ar as name, view_count FROM ai_news WHERE is_published = true
ORDER BY view_count DESC LIMIT 10;

-- Recent activity (last 7 days)
SELECT 'Product Submission' as activity, COUNT(*) as count
FROM products WHERE created_at >= NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'New User' as activity, COUNT(*) as count
FROM users WHERE created_at >= NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'Tutorial Published' as activity, COUNT(*) as count
FROM tutorials WHERE created_at >= NOW() - INTERVAL '7 days';

-- =============================================================================
-- MAINTENANCE COMMANDS
-- =============================================================================

-- Update view count (increment by 1)
UPDATE products SET view_count = view_count + 1 WHERE codename = 'tool-name';
UPDATE tutorials SET view_count = view_count + 1 WHERE id = 'tutorial-uuid';
UPDATE ai_news SET view_count = view_count + 1 WHERE id = 'news-uuid';

-- Clean old data (run monthly)
DELETE FROM product_views WHERE viewed_at < NOW() - INTERVAL '90 days';

-- Find orphaned records
SELECT 'Products without users' as issue, COUNT(*) 
FROM products p LEFT JOIN auth.users u ON p.user_id = u.id WHERE u.id IS NULL
UNION ALL
SELECT 'Favorites without products' as issue, COUNT(*)
FROM user_favorites uf LEFT JOIN products p ON uf.product_id = p.id WHERE p.id IS NULL;

-- =============================================================================
-- BACKUP IMPORTANT DATA
-- =============================================================================

-- Export approved products
SELECT * FROM products WHERE approved = true;

-- Export all tutorials
SELECT * FROM tutorials;

-- Export published news
SELECT * FROM ai_news WHERE is_published = true;

-- Export user data (non-sensitive)
SELECT id, full_name, role, created_at FROM users;

-- =============================================================================
-- PERFORMANCE MONITORING
-- =============================================================================

-- Check table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size('public.'||table_name)) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY pg_total_relation_size('public.'||table_name) DESC;

-- Check slow queries (if enabled)
-- SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check active connections
SELECT COUNT(*) as active_connections FROM pg_stat_activity WHERE state = 'active';

-- =============================================================================
-- COMMON FILTERS AND SEARCHES
-- =============================================================================

-- Search by Arabic text
SELECT * FROM products WHERE full_name ILIKE '%نص البحث%' OR description ILIKE '%نص البحث%';

-- Get free tools only
SELECT * FROM products WHERE approved = true AND is_free = true;

-- Get tools by difficulty
SELECT * FROM products WHERE approved = true AND difficulty_level = 'مبتدئ';

-- Get content with Arabic support
SELECT * FROM products WHERE approved = true AND 'العربية' = ANY(language_support);

-- Get recent content (last 30 days)
SELECT 'Product' as type, codename, created_at FROM products WHERE approved = true AND created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 'Tutorial' as type, title_ar, created_at FROM tutorials WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC; 
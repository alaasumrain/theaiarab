-- =============================================================================
-- CATEGORIZATION TABLES - Categories, Tags, and Labels
-- =============================================================================

-- Three tables for organizing content:
-- 1. categories: Main categorization system
-- 2. tags: Flexible tagging system
-- 3. labels: Additional labeling system

-- =============================================================================
-- CATEGORIES TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- name (text, UNIQUE, NOT NULL): Category name
-- icon (text): Icon identifier/class
-- created_at (timestamptz): Creation timestamp

-- Sample Categories Query:
SELECT 
    name as "اسم الفئة",
    icon as "الأيقونة",
    created_at as "تاريخ الإنشاء"
FROM categories 
ORDER BY created_at;

-- Categories with product counts
SELECT 
    c.name as "الفئة",
    c.icon as "الأيقونة",
    COUNT(p.id) as "عدد الأدوات"
FROM categories c
LEFT JOIN products p ON p.categories = c.name AND p.approved = true
GROUP BY c.id, c.name, c.icon
ORDER BY COUNT(p.id) DESC;

-- =============================================================================
-- TAGS TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- name (text, UNIQUE, NOT NULL): Tag name
-- created_at (timestamptz): Creation timestamp

-- All tags
SELECT 
    name as "اسم التاغ",
    created_at as "تاريخ الإنشاء"
FROM tags 
ORDER BY name;

-- Tags usage frequency (from products.tags array)
SELECT 
    tag as "التاغ",
    COUNT(*) as "عدد الاستخدامات"
FROM products, 
     UNNEST(tags) as tag
WHERE approved = true
GROUP BY tag
ORDER BY COUNT(*) DESC
LIMIT 20;

-- =============================================================================
-- LABELS TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- name (text, UNIQUE, NOT NULL): Label name
-- created_at (timestamptz): Creation timestamp

-- All labels
SELECT 
    name as "اسم التسمية",
    created_at as "تاريخ الإنشاء"
FROM labels 
ORDER BY name;

-- Labels usage frequency (from products.labels array)
SELECT 
    label as "التسمية",
    COUNT(*) as "عدد الاستخدامات"
FROM products, 
     UNNEST(labels) as label
WHERE approved = true
GROUP BY label
ORDER BY COUNT(*) DESC;

-- =============================================================================
-- COMBINED ANALYSIS QUERIES
-- =============================================================================

-- Complete categorization overview
SELECT 
    'فئات' as "النوع",
    COUNT(*) as "العدد الإجمالي"
FROM categories
UNION ALL
SELECT 
    'تاغات' as "النوع",
    COUNT(*) as "العدد الإجمالي"
FROM tags
UNION ALL
SELECT 
    'تسميات' as "النوع",
    COUNT(*) as "العدد الإجمالي"
FROM labels;

-- Most popular categorization terms
WITH category_usage AS (
    SELECT categories as term, COUNT(*) as usage_count, 'فئة' as type
    FROM products 
    WHERE approved = true AND categories IS NOT NULL
    GROUP BY categories
),
tag_usage AS (
    SELECT tag as term, COUNT(*) as usage_count, 'تاغ' as type
    FROM products, UNNEST(tags) as tag
    WHERE approved = true
    GROUP BY tag
),
label_usage AS (
    SELECT label as term, COUNT(*) as usage_count, 'تسمية' as type
    FROM products, UNNEST(labels) as label
    WHERE approved = true
    GROUP BY label
)
SELECT term as "المصطلح", type as "النوع", usage_count as "الاستخدامات"
FROM category_usage
UNION ALL
SELECT term, type, usage_count FROM tag_usage
UNION ALL
SELECT term, type, usage_count FROM label_usage
ORDER BY usage_count DESC
LIMIT 30;

-- Products with comprehensive categorization
SELECT 
    p.codename as "اسم الأداة",
    p.categories as "الفئة",
    ARRAY_TO_STRING(p.tags, ', ') as "التاغات",
    ARRAY_TO_STRING(p.labels, ', ') as "التسميات",
    p.view_count as "المشاهدات"
FROM products p
WHERE p.approved = true
AND (p.categories IS NOT NULL OR p.tags IS NOT NULL OR p.labels IS NOT NULL)
ORDER BY p.view_count DESC
LIMIT 20;

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Find products without categorization
SELECT 
    codename as "اسم الأداة",
    full_name as "المطور",
    CASE 
        WHEN categories IS NULL THEN 'بدون فئة'
        ELSE 'لديه فئة'
    END as "حالة الفئة",
    CASE 
        WHEN tags IS NULL OR array_length(tags, 1) = 0 THEN 'بدون تاغات'
        ELSE 'لديه تاغات'
    END as "حالة التاغات"
FROM products 
WHERE approved = true
AND (categories IS NULL OR tags IS NULL OR array_length(tags, 1) = 0)
ORDER BY view_count DESC;

-- Unused categories (not assigned to any approved products)
SELECT 
    c.name as "فئة غير مستخدمة"
FROM categories c
LEFT JOIN products p ON p.categories = c.name AND p.approved = true
WHERE p.id IS NULL;

-- Add new category
-- INSERT INTO categories (name, icon) 
-- VALUES ('اسم الفئة الجديدة', 'icon-name');

-- Add new tag
-- INSERT INTO tags (name) 
-- VALUES ('تاغ جديد');

-- Add new label
-- INSERT INTO labels (name) 
-- VALUES ('تسمية جديدة');

-- Update product categories
-- UPDATE products 
-- SET categories = 'الفئة الجديدة'
-- WHERE codename = 'tool-name';

-- Add tags to product
-- UPDATE products 
-- SET tags = ARRAY['تاغ1', 'تاغ2', 'تاغ3']
-- WHERE codename = 'tool-name';

-- Add labels to product
-- UPDATE products 
-- SET labels = ARRAY['تسمية1', 'تسمية2']
-- WHERE codename = 'tool-name'; 
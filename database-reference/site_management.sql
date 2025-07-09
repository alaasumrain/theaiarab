-- =============================================================================
-- SITE MANAGEMENT - Settings and Email Campaigns
-- =============================================================================

-- Two new tables for site administration:
-- 1. site_settings: Configuration and settings storage
-- 2. email_campaigns: Newsletter and email campaign management

-- =============================================================================
-- SITE_SETTINGS TABLE
-- =============================================================================

-- Table Schema:
-- id (serial, PK): Auto-incrementing primary key
-- key (varchar, UNIQUE, NOT NULL): Setting key identifier
-- value (jsonb, NOT NULL): Setting value in JSON format
-- description (text): Human-readable description
-- category (varchar, NOT NULL): Setting category ('general', 'email', etc.)
-- is_sensitive (boolean): Whether setting contains sensitive data
-- created_at (timestamptz): Creation timestamp
-- updated_at (timestamptz): Last update timestamp
-- updated_by (uuid, FK): References auth.users.id (who last updated)

-- =============================================================================
-- BASIC SITE SETTINGS QUERIES
-- =============================================================================

-- Get all site settings
SELECT 
    key as "المفتاح",
    value as "القيمة",
    description as "الوصف",
    category as "الفئة"
FROM site_settings 
ORDER BY category, key;

-- Get settings by category
SELECT key, value, description 
FROM site_settings 
WHERE category = 'general';

-- Get specific setting value
SELECT value 
FROM site_settings 
WHERE key = 'site_name';

-- Get all feature toggles
SELECT 
    key as "الميزة",
    (value::boolean) as "مفعلة"
FROM site_settings 
WHERE category = 'features';

-- =============================================================================
-- SITE SETTINGS BY CATEGORY
-- =============================================================================

-- General settings
SELECT key, value, description 
FROM site_settings 
WHERE category = 'general'
ORDER BY key;

-- Contact information
SELECT key, value, description 
FROM site_settings 
WHERE category = 'contact'
ORDER BY key;

-- Social media settings
SELECT key, value, description 
FROM site_settings 
WHERE category = 'social'
ORDER BY key;

-- Email configuration
SELECT 
    key as "إعداد البريد",
    CASE 
        WHEN is_sensitive = true THEN '***مخفي***'
        ELSE value::text
    END as "القيمة"
FROM site_settings 
WHERE category = 'email'
ORDER BY key;

-- Display preferences
SELECT key, value, description 
FROM site_settings 
WHERE category = 'display'
ORDER BY key;

-- =============================================================================
-- SITE SETTINGS MANAGEMENT
-- =============================================================================

-- Update a setting
-- UPDATE site_settings 
-- SET value = '"القيمة الجديدة"'
-- WHERE key = 'site_name_ar';

-- Add new setting
-- INSERT INTO site_settings (key, value, description, category)
-- VALUES ('new_feature_enabled', 'true', 'تفعيل ميزة جديدة', 'features');

-- Toggle a feature
-- UPDATE site_settings 
-- SET value = (NOT (value::boolean))::text::jsonb
-- WHERE key = 'maintenance_mode';

-- =============================================================================
-- EMAIL_CAMPAIGNS TABLE
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier
-- name (varchar, NOT NULL): Campaign name
-- subject (varchar, NOT NULL): Email subject line
-- content (text, NOT NULL): Email content/body
-- status (varchar): 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
-- scheduled_for (timestamptz): When to send (for scheduled campaigns)
-- sent_at (timestamptz): When it was actually sent
-- recipient_count (int): Number of recipients
-- open_count (int): How many opened the email
-- click_count (int): How many clicked links
-- created_by (uuid, FK): References auth.users.id
-- created_at (timestamptz): Creation timestamp
-- updated_at (timestamptz): Last update timestamp

-- =============================================================================
-- EMAIL CAMPAIGNS QUERIES
-- =============================================================================

-- Get all campaigns
SELECT 
    name as "اسم الحملة",
    subject as "موضوع الرسالة",
    status as "الحالة",
    recipient_count as "عدد المستقبلين",
    open_count as "عدد الفتحات",
    click_count as "عدد النقرات",
    created_at as "تاريخ الإنشاء"
FROM email_campaigns 
ORDER BY created_at DESC;

-- Get draft campaigns
SELECT 
    name,
    subject,
    created_at
FROM email_campaigns 
WHERE status = 'draft'
ORDER BY created_at DESC;

-- Get sent campaigns with statistics
SELECT 
    name as "الحملة",
    subject as "الموضوع",
    recipient_count as "المرسل إليهم",
    open_count as "الفتحات",
    ROUND((open_count::decimal / recipient_count) * 100, 2) as "معدل الفتح %",
    click_count as "النقرات",
    ROUND((click_count::decimal / open_count) * 100, 2) as "معدل النقر %",
    sent_at as "تاريخ الإرسال"
FROM email_campaigns 
WHERE status = 'sent' AND recipient_count > 0
ORDER BY sent_at DESC;

-- Get scheduled campaigns
SELECT 
    name as "الحملة",
    subject as "الموضوع",
    scheduled_for as "موعد الإرسال",
    EXTRACT(HOURS FROM scheduled_for - NOW()) as "ساعات متبقية"
FROM email_campaigns 
WHERE status = 'scheduled'
ORDER BY scheduled_for ASC;

-- =============================================================================
-- CAMPAIGN PERFORMANCE ANALYTICS
-- =============================================================================

-- Overall campaign performance
SELECT 
    COUNT(*) as "إجمالي الحملات",
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as "المرسلة",
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as "المسودات",
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as "المجدولة",
    SUM(recipient_count) as "إجمالي المرسل إليهم",
    SUM(open_count) as "إجمالي الفتحات",
    SUM(click_count) as "إجمالي النقرات"
FROM email_campaigns;

-- Average performance metrics
SELECT 
    ROUND(AVG(open_count::decimal / NULLIF(recipient_count, 0)) * 100, 2) as "متوسط معدل الفتح %",
    ROUND(AVG(click_count::decimal / NULLIF(open_count, 0)) * 100, 2) as "متوسط معدل النقر %",
    AVG(recipient_count) as "متوسط عدد المستقبلين"
FROM email_campaigns 
WHERE status = 'sent' AND recipient_count > 0;

-- Top performing campaigns
SELECT 
    name as "الحملة",
    subject as "الموضوع",
    ROUND((open_count::decimal / recipient_count) * 100, 2) as "معدل الفتح %",
    ROUND((click_count::decimal / open_count) * 100, 2) as "معدل النقر %",
    sent_at as "تاريخ الإرسال"
FROM email_campaigns 
WHERE status = 'sent' AND recipient_count > 0
ORDER BY (open_count::decimal / recipient_count) DESC
LIMIT 10;

-- Monthly campaign summary
SELECT 
    DATE_TRUNC('month', sent_at) as "الشهر",
    COUNT(*) as "عدد الحملات",
    SUM(recipient_count) as "إجمالي المستقبلين",
    SUM(open_count) as "إجمالي الفتحات",
    ROUND(AVG(open_count::decimal / NULLIF(recipient_count, 0)) * 100, 2) as "متوسط معدل الفتح %"
FROM email_campaigns 
WHERE status = 'sent' AND sent_at IS NOT NULL
GROUP BY DATE_TRUNC('month', sent_at)
ORDER BY DATE_TRUNC('month', sent_at) DESC;

-- =============================================================================
-- CAMPAIGN MANAGEMENT
-- =============================================================================

-- Create new campaign
-- INSERT INTO email_campaigns (name, subject, content, created_by)
-- VALUES ('حملة ترحيبية', 'مرحباً بك في ذا إيه آي عرب', 'محتوى الرسالة...', auth.uid());

-- Schedule campaign
-- UPDATE email_campaigns 
-- SET status = 'scheduled', scheduled_for = '2024-01-15 10:00:00+00'
-- WHERE id = 'campaign-uuid';

-- Cancel scheduled campaign
-- UPDATE email_campaigns 
-- SET status = 'cancelled'
-- WHERE id = 'campaign-uuid' AND status = 'scheduled';

-- Mark campaign as sent
-- UPDATE email_campaigns 
-- SET status = 'sent', sent_at = NOW(), recipient_count = 1500
-- WHERE id = 'campaign-uuid';

-- Update campaign statistics
-- UPDATE email_campaigns 
-- SET open_count = open_count + 1
-- WHERE id = 'campaign-uuid';

-- =============================================================================
-- INTEGRATED SITE MANAGEMENT QUERIES
-- =============================================================================

-- Get newsletter settings
SELECT 
    key,
    value,
    description
FROM site_settings 
WHERE key IN ('newsletter_enabled', 'smtp_host', 'smtp_from_email', 'smtp_from_name');

-- Check if maintenance mode is enabled
SELECT 
    (value::boolean) as maintenance_mode_enabled
FROM site_settings 
WHERE key = 'maintenance_mode';

-- Get site info for email templates
SELECT 
    json_build_object(
        'site_name', (SELECT value FROM site_settings WHERE key = 'site_name'),
        'site_name_ar', (SELECT value FROM site_settings WHERE key = 'site_name_ar'),
        'contact_email', (SELECT value FROM site_settings WHERE key = 'contact_email'),
        'social_twitter', (SELECT value FROM site_settings WHERE key = 'social_twitter')
    ) as site_info;

-- Dashboard summary for admin
SELECT 
    'إعدادات الموقع' as "القسم",
    COUNT(*) as "العدد"
FROM site_settings
UNION ALL
SELECT 
    'حملات البريد الإلكتروني' as "القسم",
    COUNT(*) as "العدد"
FROM email_campaigns
UNION ALL
SELECT 
    'الحملات المرسلة' as "القسم",
    COUNT(*) as "العدد"
FROM email_campaigns WHERE status = 'sent'; 
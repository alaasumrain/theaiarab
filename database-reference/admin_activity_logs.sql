-- =============================================================================
-- ADMIN ACTIVITY LOGS - Audit Trail for Administrative Actions
-- =============================================================================

-- Tracks all administrative actions performed by admin users
-- Provides comprehensive audit trail for security and compliance

-- =============================================================================
-- TABLE SCHEMA
-- =============================================================================

-- Table Schema:
-- id (uuid, PK): Unique identifier for each log entry
-- admin_id (uuid, NOT NULL, FK): References auth.users.id (who performed action)
-- action (text, NOT NULL): Action performed (create, update, delete, approve, etc.)
-- resource_type (text, NOT NULL): Type of resource affected (products, users, etc.)
-- resource_id (uuid): Specific resource ID (nullable for bulk actions)
-- details (jsonb): Additional context about the action
-- created_at (timestamptz): When the action was performed

-- =============================================================================
-- BASIC ACTIVITY LOG QUERIES
-- =============================================================================

-- Get all recent admin activities
SELECT 
    aal.action as "الإجراء",
    aal.resource_type as "نوع المورد",
    aal.resource_id as "معرف المورد",
    u.full_name as "المشرف",
    aal.created_at as "التاريخ",
    aal.details as "التفاصيل"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
ORDER BY aal.created_at DESC
LIMIT 50;

-- Get activities by specific admin
SELECT 
    action as "الإجراء",
    resource_type as "نوع المورد",
    resource_id as "معرف المورد",
    created_at as "التاريخ",
    details as "التفاصيل"
FROM admin_activity_logs
WHERE admin_id = 'admin-uuid-here'
ORDER BY created_at DESC;

-- Get activities for specific resource type
SELECT 
    aal.action as "الإجراء",
    u.full_name as "المشرف",
    aal.resource_id as "معرف المورد",
    aal.created_at as "التاريخ",
    aal.details as "التفاصيل"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.resource_type = 'products'
ORDER BY aal.created_at DESC;

-- Get today's admin activities
SELECT 
    aal.action as "الإجراء",
    aal.resource_type as "نوع المورد",
    u.full_name as "المشرف",
    aal.created_at as "التاريخ"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE DATE(aal.created_at) = CURRENT_DATE
ORDER BY aal.created_at DESC;

-- =============================================================================
-- ACTIVITY ANALYTICS
-- =============================================================================

-- Admin activity summary
SELECT 
    u.full_name as "المشرف",
    COUNT(*) as "عدد الإجراءات",
    COUNT(DISTINCT resource_type) as "أنواع الموارد",
    MAX(aal.created_at) as "آخر نشاط"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.created_at >= NOW() - INTERVAL '30 days'
GROUP BY aal.admin_id, u.full_name
ORDER BY COUNT(*) DESC;

-- Actions by type
SELECT 
    action as "نوع الإجراء",
    COUNT(*) as "العدد",
    COUNT(DISTINCT admin_id) as "عدد المشرفين",
    MAX(created_at) as "آخر مرة"
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY action
ORDER BY COUNT(*) DESC;

-- Resources by activity
SELECT 
    resource_type as "نوع المورد",
    COUNT(*) as "عدد الإجراءات",
    COUNT(DISTINCT admin_id) as "عدد المشرفين",
    MAX(created_at) as "آخر نشاط"
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY resource_type
ORDER BY COUNT(*) DESC;

-- Daily activity trends
SELECT 
    DATE(created_at) as "التاريخ",
    COUNT(*) as "عدد الإجراءات",
    COUNT(DISTINCT admin_id) as "المشرفين النشطين",
    COUNT(DISTINCT resource_type) as "أنواع الموارد"
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- =============================================================================
-- SPECIFIC ACTIVITY TRACKING
-- =============================================================================

-- Product management activities
SELECT 
    aal.action as "الإجراء",
    p.codename as "اسم المنتج",
    u.full_name as "المشرف",
    aal.created_at as "التاريخ",
    aal.details->'old_values' as "القيم السابقة",
    aal.details->'new_values' as "القيم الجديدة"
FROM admin_activity_logs aal
LEFT JOIN products p ON aal.resource_id = p.id
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.resource_type = 'products'
ORDER BY aal.created_at DESC;

-- User management activities
SELECT 
    aal.action as "الإجراء",
    target_user.full_name as "المستخدم المستهدف",
    admin_user.full_name as "المشرف",
    aal.created_at as "التاريخ",
    aal.details as "التفاصيل"
FROM admin_activity_logs aal
LEFT JOIN auth.users target_auth ON aal.resource_id = target_auth.id
LEFT JOIN users target_user ON target_auth.id = target_user.id
LEFT JOIN auth.users admin_auth ON aal.admin_id = admin_auth.id
LEFT JOIN users admin_user ON admin_auth.id = admin_user.id
WHERE aal.resource_type = 'users'
ORDER BY aal.created_at DESC;

-- Content management activities (news, tutorials)
SELECT 
    aal.action as "الإجراء",
    aal.resource_type as "نوع المحتوى",
    aal.resource_id as "معرف المحتوى",
    u.full_name as "المشرف",
    aal.created_at as "التاريخ",
    aal.details->'title' as "العنوان"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.resource_type IN ('tutorials', 'ai_news')
ORDER BY aal.created_at DESC;

-- =============================================================================
-- SECURITY MONITORING
-- =============================================================================

-- Suspicious activity detection
SELECT 
    u.full_name as "المشرف",
    COUNT(*) as "عدد الإجراءات",
    COUNT(DISTINCT resource_type) as "أنواع الموارد",
    MIN(aal.created_at) as "بداية النشاط",
    MAX(aal.created_at) as "نهاية النشاط"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.created_at >= NOW() - INTERVAL '1 hour'
GROUP BY aal.admin_id, u.full_name
HAVING COUNT(*) > 20  -- More than 20 actions in an hour
ORDER BY COUNT(*) DESC;

-- Failed or unusual actions
SELECT 
    aal.action as "الإجراء",
    aal.resource_type as "نوع المورد",
    u.full_name as "المشرف",
    aal.created_at as "التاريخ",
    aal.details as "التفاصيل"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.details ? 'error' 
   OR aal.details ? 'failed'
   OR aal.action LIKE '%delete%'
ORDER BY aal.created_at DESC;

-- Admin login tracking (if implemented)
SELECT 
    u.full_name as "المشرف",
    COUNT(*) as "عدد تسجيلات الدخول",
    MAX(aal.created_at) as "آخر دخول",
    COUNT(DISTINCT DATE(aal.created_at)) as "أيام النشاط"
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
WHERE aal.action = 'login' 
  AND aal.created_at >= NOW() - INTERVAL '30 days'
GROUP BY aal.admin_id, u.full_name
ORDER BY MAX(aal.created_at) DESC;

-- =============================================================================
-- LOGGING HELPER FUNCTIONS
-- =============================================================================

-- The log_admin_activity function is already created by the migration
-- Usage examples:

-- Log product approval
-- SELECT log_admin_activity(
--     'approve_product',
--     'products',
--     'product-uuid-here',
--     '{"codename": "example-tool", "approved_by": "admin"}'::jsonb
-- );

-- Log user role change
-- SELECT log_admin_activity(
--     'change_user_role',
--     'users', 
--     'user-uuid-here',
--     '{"old_role": "user", "new_role": "admin"}'::jsonb
-- );

-- Log bulk operations
-- SELECT log_admin_activity(
--     'bulk_delete_products',
--     'products',
--     NULL,  -- No specific resource ID for bulk operations
--     '{"count": 5, "criteria": "unapproved"}'::jsonb
-- );

-- =============================================================================
-- MAINTENANCE QUERIES
-- =============================================================================

-- Clean up old logs (older than 1 year)
-- DELETE FROM admin_activity_logs 
-- WHERE created_at < NOW() - INTERVAL '1 year';

-- Archive old logs (move to archive table)
-- INSERT INTO admin_activity_logs_archive 
-- SELECT * FROM admin_activity_logs 
-- WHERE created_at < NOW() - INTERVAL '6 months';

-- Get storage usage
SELECT 
    pg_size_pretty(pg_total_relation_size('admin_activity_logs')) as "حجم الجدول",
    COUNT(*) as "عدد السجلات",
    MIN(created_at) as "أقدم سجل",
    MAX(created_at) as "أحدث سجل"
FROM admin_activity_logs;

-- =============================================================================
-- COMMON ADMIN DASHBOARD QUERIES
-- =============================================================================

-- Recent activity summary for dashboard
SELECT 
    COUNT(*) as total_activities,
    COUNT(DISTINCT admin_id) as active_admins,
    COUNT(DISTINCT resource_type) as resource_types_affected,
    MAX(created_at) as last_activity
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Top 10 most recent activities for dashboard
SELECT 
    aal.action,
    aal.resource_type,
    u.full_name,
    aal.created_at,
    CASE 
        WHEN aal.resource_type = 'products' THEN 
            (SELECT codename FROM products WHERE id = aal.resource_id)
        WHEN aal.resource_type = 'users' THEN 
            (SELECT full_name FROM users WHERE id = aal.resource_id)
        ELSE aal.resource_id::text
    END as resource_name
FROM admin_activity_logs aal
LEFT JOIN auth.users au ON aal.admin_id = au.id
LEFT JOIN users u ON au.id = u.id
ORDER BY aal.created_at DESC
LIMIT 10; 
import { Suspense } from "react"
import { 
  Package, 
  Users, 
  Eye, 
  CheckCircle, 
  Clock, 
  Star,
  TrendingUp,
  Calendar
} from "lucide-react"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

async function getAdminStats() {
  const supabase = createClient()

  // Get products statistics
  const { data: products } = await supabase
    .from('products')
    .select('id, approved, view_count, created_at')

  // Get users count
  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Get recent products (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, codename, arabic_name, created_at, approved, view_count')
    .gte('created_at', weekAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate stats
  const totalProducts = products?.length || 0
  const approvedProducts = products?.filter(p => p.approved).length || 0
  const pendingProducts = products?.filter(p => !p.approved).length || 0
  const totalViews = products?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0

  return {
    totalProducts,
    approvedProducts,
    pendingProducts,
    totalViews,
    usersCount: usersCount || 0,
    recentProducts: recentProducts || []
  }
}

async function QuickActions() {
  const supabase = createClient()
  
  // Get pending products count for quick action badge
  const { count: pendingCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('approved', false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          إجراءات سريعة
        </CardTitle>
        <CardDescription>
          المهام التي تحتاج انتباهك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-between">
          <Link href="/admin/products?filter=pending">
            مراجعة الأدوات المعلقة
            {pendingCount && pendingCount > 0 && (
              <Badge variant="destructive">{pendingCount}</Badge>
            )}
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/products?action=add">
            إضافة أداة جديدة
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/users">
            إدارة المستخدمين
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: {
  title: string
  value: string | number
  description: string
  icon: any
  trend?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className="text-xs text-green-600 mt-1">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          نظرة عامة على إحصائيات موقع العربي للذكاء الاصطناعي
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي الأدوات"
          value={stats.totalProducts}
          description="عدد الأدوات في النظام"
          icon={Package}
        />
        <StatsCard
          title="أدوات معتمدة"
          value={stats.approvedProducts}
          description="أدوات مراجعة ومعتمدة"
          icon={CheckCircle}
        />
        <StatsCard
          title="في انتظار المراجعة"
          value={stats.pendingProducts}
          description="أدوات تحتاج مراجعة"
          icon={Clock}
        />
        <StatsCard
          title="إجمالي المشاهدات"
          value={stats.totalViews.toLocaleString()}
          description="مشاهدات جميع الأدوات"
          icon={Eye}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Products */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              الأدوات الحديثة
            </CardTitle>
            <CardDescription>
              آخر الأدوات المضافة في الأسبوع الماضي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {product.codename}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {product.arabic_name && (
                          <p className="text-sm text-muted-foreground">
                            {product.arabic_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(product.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.approved ? "default" : "secondary"}>
                        {product.approved ? "معتمد" : "معلق"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {product.view_count || 0} مشاهدة
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد أدوات جديدة هذا الأسبوع
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products">
                عرض جميع الأدوات
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <QuickActions />
        </Suspense>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إحصائيات المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
            <p className="text-xs text-muted-foreground">
              إجمالي المستخدمين المسجلين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              معدل الموافقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProducts > 0 
                ? Math.round((stats.approvedProducts / stats.totalProducts) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              نسبة الأدوات المعتمدة
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { Suspense } from "react"
import { 
  Activity,
  Search, 
  Filter, 
  Calendar,
  User,
  Package,
  FileText,
  Shield,
  Clock,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActivityRow } from "./activity-row"

interface ActivityLog {
  id: string
  admin_id: string
  admin_email?: string
  admin_username?: string
  action: string
  resource_type: string
  resource_id?: string
  details?: any
  created_at: string
}

async function getActivityLogs(
  searchTerm?: string,
  filter?: string,
  dateFilter?: string,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<ActivityLog[]> {
  const supabase = createClient()
  
  // Join with users table to get admin details
  let query = supabase
    .from('admin_activity_logs')
    .select(`
      *,
      admin:users!admin_id (
        email,
        username
      )
    `)

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`
    )
  }

  // Apply resource type filter
  if (filter && filter !== 'all') {
    query = query.eq('resource_type', filter)
  }

  // Apply date filter
  if (dateFilter) {
    const now = new Date()
    let startDate: Date
    
    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      default:
        startDate = new Date(0)
    }
    
    query = query.gte('created_at', startDate.toISOString())
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  query = query.limit(100) // Limit to last 100 logs

  const { data, error } = await query

  if (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }

  // Transform the data
  return (data || []).map(log => ({
    id: log.id,
    admin_id: log.admin_id,
    admin_email: log.admin?.email,
    admin_username: log.admin?.username,
    action: log.action,
    resource_type: log.resource_type,
    resource_id: log.resource_id,
    details: log.details,
    created_at: log.created_at
  }))
}

export default async function ActivityLogsPage({
  searchParams,
}: {
  searchParams: {
    search?: string
    filter?: string
    date?: string
    sort?: string
    order?: 'asc' | 'desc'
  }
}) {
  const { search, filter, date, sort = 'created_at', order = 'desc' } = searchParams
  const logs = await getActivityLogs(search, filter, date, sort, order)

  // Calculate stats
  const stats = {
    total: logs.length,
    today: logs.filter(log => {
      const logDate = new Date(log.created_at)
      const today = new Date()
      return logDate.toDateString() === today.toDateString()
    }).length,
    products: logs.filter(log => log.resource_type === 'product').length,
    users: logs.filter(log => log.resource_type === 'user').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">سجل النشاطات</h1>
          <p className="text-muted-foreground">
            تتبع جميع إجراءات المدراء في النظام
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النشاطات</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">آخر 100 نشاط</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نشاطات اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجراءات المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.products}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجراءات المستخدمين</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.users}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>تصفية السجلات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في النشاطات..."
                  defaultValue={search}
                  className="pr-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  نوع المورد ({filter || 'الكل'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>نوع المورد</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity">جميع الأنواع</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?filter=product">المنتجات</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?filter=user">المستخدمين</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?filter=news">الأخبار</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?filter=tutorial">الدروس</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  الفترة ({date === 'today' ? 'اليوم' : date === 'week' ? 'الأسبوع' : date === 'month' ? 'الشهر' : 'الكل'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>الفترة الزمنية</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity">جميع الأوقات</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?date=today">اليوم</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?date=week">آخر 7 أيام</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/activity?date=month">آخر 30 يوم</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل النشاطات</CardTitle>
          <CardDescription>
            آخر {logs.length} نشاط في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>المدير</TableHead>
                <TableHead>الإجراء</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>التفاصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <ActivityRow key={log.id} log={log} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    لا توجد نشاطات تطابق معايير البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
import { Suspense } from "react"
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  MoreHorizontal,
  Eye,
  Edit
} from "lucide-react"
import Link from "next/link"

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
import { UserRow } from "./user-row"

interface User {
  id: string
  email: string
  username?: string
  role: 'user' | 'admin'
  created_at: string
  last_sign_in_at?: string
  favorites_count?: number
  reviews_count?: number
  views_count?: number
}

async function getUsers(
  searchTerm?: string,
  filter?: string,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<User[]> {
  const supabase = createClient()
  
  // First get users with their stats
  let query = supabase
    .from('users')
    .select(`
      *,
      user_favorites!left(count),
      user_reviews!left(count),
      product_views!left(count)
    `)

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`
    )
  }

  // Apply role filter
  if (filter === 'admin') {
    query = query.eq('role', 'admin')
  } else if (filter === 'user') {
    query = query.eq('role', 'user')
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  // Transform the data to include counts
  return (data || []).map(user => ({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    favorites_count: user.user_favorites?.[0]?.count || 0,
    reviews_count: user.user_reviews?.[0]?.count || 0,
    views_count: user.product_views?.[0]?.count || 0
  }))
}

export default async function UsersManagement({
  searchParams,
}: {
  searchParams: {
    search?: string
    filter?: string
    sort?: string
    order?: 'asc' | 'desc'
  }
}) {
  const { search, filter, sort = 'created_at', order = 'desc' } = searchParams
  const users = await getUsers(search, filter, sort, order)

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    activeToday: users.filter(u => {
      if (!u.last_sign_in_at) return false
      const lastSignIn = new Date(u.last_sign_in_at)
      const today = new Date()
      return lastSignIn.toDateString() === today.toDateString()
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">
            عرض وإدارة حسابات المستخدمين والصلاحيات
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدراء</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستخدمون عاديون</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.regularUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نشطون اليوم</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>تصفية البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالبريد الإلكتروني أو اسم المستخدم..."
                  defaultValue={search}
                  className="pr-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  تصفية ({filter || 'الكل'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>نوع المستخدم</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/users">جميع المستخدمين</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users?filter=admin">المدراء فقط</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users?filter=user">المستخدمون العاديون</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  ترتيب ({sort === 'created_at' ? 'التاريخ' : sort === 'last_sign_in_at' ? 'آخر دخول' : 'البريد'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users?${new URLSearchParams({ ...searchParams, sort: 'created_at', order: 'desc' })}`}>
                    الأحدث أولاً
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users?${new URLSearchParams({ ...searchParams, sort: 'last_sign_in_at', order: 'desc' })}`}>
                    آخر دخول
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users?${new URLSearchParams({ ...searchParams, sort: 'email', order: 'asc' })}`}>
                    البريد الإلكتروني
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            {users.length} مستخدم مسجل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>الصلاحية</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>آخر دخول</TableHead>
                <TableHead>النشاط</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    لا يوجد مستخدمون يطابقون معايير البحث
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
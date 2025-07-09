import { Suspense } from "react"
import { 
  MessageSquare, 
  Search, 
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewRow } from "./review-row"

interface Review {
  id: string
  type: 'user' | 'product'
  rating: number
  comment: string
  created_at: string
  user_id?: string
  user_email?: string
  user_name?: string
  product_id?: string
  product_name?: string
  is_featured?: boolean
  status?: 'pending' | 'approved' | 'rejected'
}

async function getUserReviews(
  searchTerm?: string,
  filter?: string
): Promise<Review[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('user_reviews')
    .select(`
      *,
      user:users!user_id (
        email,
        username
      ),
      product:products!product_id (
        codename,
        arabic_name
      )
    `)

  // Apply search filter
  if (searchTerm) {
    query = query.ilike('comment', `%${searchTerm}%`)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }

  return (data || []).map(review => ({
    id: review.id,
    type: 'user' as const,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user_id: review.user_id,
    user_email: review.user?.email,
    user_name: review.user?.username,
    product_id: review.product_id,
    product_name: review.product?.codename || review.product?.arabic_name,
    is_featured: review.is_featured,
    status: 'approved' // User reviews are always approved
  }))
}

async function getProductReviews(
  searchTerm?: string,
  filter?: string
): Promise<Review[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('product_reviews')
    .select(`
      *,
      product:products!product_id (
        codename,
        arabic_name
      )
    `)

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `reviewer_name.ilike.%${searchTerm}%,comment.ilike.%${searchTerm}%`
    )
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching product reviews:', error)
    return []
  }

  return (data || []).map(review => ({
    id: review.id,
    type: 'product' as const,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    user_name: review.reviewer_name,
    product_id: review.product_id,
    product_name: review.product?.codename || review.product?.arabic_name,
    is_featured: review.is_featured,
    status: 'approved' // Product reviews are always approved for now
  }))
}

export default async function ReviewsModeration({
  searchParams,
}: {
  searchParams: {
    search?: string
    filter?: string
    tab?: string
  }
}) {
  const { search, filter, tab = 'all' } = searchParams
  
  const [userReviews, productReviews] = await Promise.all([
    getUserReviews(search, filter),
    getProductReviews(search, filter)
  ])

  const allReviews = [...userReviews, ...productReviews]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const stats = {
    total: allReviews.length,
    userReviews: userReviews.length,
    productReviews: productReviews.length,
    featured: allReviews.filter(r => r.is_featured).length,
    averageRating: allReviews.length > 0 
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : '0.0',
    highRated: allReviews.filter(r => r.rating >= 4).length,
    lowRated: allReviews.filter(r => r.rating <= 2).length
  }

  const displayReviews = tab === 'user' ? userReviews : 
                        tab === 'product' ? productReviews : 
                        allReviews

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مراجعة التقييمات</h1>
          <p className="text-muted-foreground">
            مراجعة وإدارة تقييمات المستخدمين والمنتجات
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التقييمات</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.userReviews} من المستخدمين، {stats.productReviews} عامة
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتوسط العام</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              من 5 نجوم
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تقييمات عالية</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highRated}</div>
            <p className="text-xs text-muted-foreground">4+ نجوم</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تقييمات منخفضة</CardTitle>
            <ThumbsDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowRated}</div>
            <p className="text-xs text-muted-foreground">2- نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">جميع التقييمات</TabsTrigger>
          <TabsTrigger value="user">تقييمات المستخدمين</TabsTrigger>
          <TabsTrigger value="product">التقييمات العامة</TabsTrigger>
        </TabsList>
        
        <TabsContent value={tab} className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في التقييمات..."
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
                    <DropdownMenuLabel>تصفية التقييمات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviews">جميع التقييمات</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviews?filter=featured">المميزة فقط</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviews?filter=high">عالية التقييم (4+)</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviews?filter=low">منخفضة التقييم (2-)</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {tab === 'user' && 'تقييمات المستخدمين'}
                {tab === 'product' && 'التقييمات العامة'}
                {tab === 'all' && 'جميع التقييمات'}
              </CardTitle>
              <CardDescription>
                {displayReviews.length} تقييم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المراجع</TableHead>
                    <TableHead>المنتج</TableHead>
                    <TableHead>التقييم</TableHead>
                    <TableHead>التعليق</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayReviews.length > 0 ? (
                    displayReviews.map((review) => (
                      <ReviewRow key={`${review.type}-${review.id}`} review={review} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا توجد تقييمات تطابق معايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
import { Suspense } from "react"
import Link from "next/link"
import { Plus, Eye, Calendar, Edit, Trash2, Globe } from "lucide-react"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

async function getNewsArticles() {
  const supabase = createClient()
  
  const { data: articles, error } = await supabase
    .from('ai_news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return articles || []
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export default async function AdminNewsPage() {
  const articles = await getNewsArticles()

  const publishedCount = articles.filter(a => a.is_published).length
  const draftCount = articles.filter(a => !a.is_published).length
  const featuredCount = articles.filter(a => a.is_featured).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الأخبار</h1>
          <p className="text-muted-foreground">
            إدارة مقالات الأخبار والمحتوى التعليمي
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="ml-2 h-4 w-4" />
            مقال جديد
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المقالات</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مقالات منشورة</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مسودات</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مقالات مميزة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{featuredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المقالات</CardTitle>
          <CardDescription>
            إدارة وتحرير مقالات الأخبار والمحتوى التعليمي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>المؤلف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>تاريخ النشر</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {truncateText(article.title_ar, 50)}
                      </div>
                      {article.title_en && (
                        <div className="text-sm text-muted-foreground">
                          {truncateText(article.title_en, 50)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>{article.author || 'غير محدد'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={article.is_published ? 'default' : 'secondary'}>
                        {article.is_published ? 'منشور' : 'مسودة'}
                      </Badge>
                      {article.is_featured && (
                        <Badge variant="outline" className="text-xs">
                          مميز
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.view_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(article.published_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/news/${article.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/news/${article.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {articles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد مقالات بعد</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/news/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء أول مقال
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
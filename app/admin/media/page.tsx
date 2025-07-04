import { Suspense } from "react"
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Grid3X3,
  List,
  Trash2,
  Download,
  Eye,
  Copy
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MediaUploadDialog } from "./media-upload-dialog"
import { MediaBrowser } from "./media-browser"

export default function MediaManagement({
  searchParams,
}: {
  searchParams: {
    bucket?: string
    search?: string
    type?: string
    view?: 'grid' | 'list'
  }
}) {
  const { bucket = 'product-logos', search, type, view = 'grid' } = searchParams

  const buckets = [
    { id: 'product-logos', name: 'شعارات الأدوات', description: 'صور شعارات أدوات الذكاء الاصطناعي' },
    { id: 'news-images', name: 'صور الأخبار', description: 'صور مقالات ومحتوى الأخبار' },
    { id: 'tutorial-images', name: 'صور الدروس', description: 'صور وأشكال توضيحية للدروس التعليمية' },
    { id: 'site-assets', name: 'أصول الموقع', description: 'صور الواجهة والعناصر العامة' },
  ]

  const currentBucket = buckets.find(b => b.id === bucket) || buckets[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مكتبة الوسائط</h1>
          <p className="text-muted-foreground">
            إدارة وتنظيم جميع صور وملفات الموقع
          </p>
        </div>
        <MediaUploadDialog bucket={bucket as any}>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            رفع ملفات
          </Button>
        </MediaUploadDialog>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <MediaStats />
      </Suspense>

      {/* Storage Buckets Tabs */}
      <Tabs value={bucket} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            {buckets.map((b) => (
              <TabsTrigger 
                key={b.id} 
                value={b.id}
                className="text-xs"
                asChild
              >
                <a href={`/admin/media?bucket=${b.id}`}>
                  {b.name.split(' ')[0]}
                </a>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الملفات..."
                className="pr-10 w-64"
                defaultValue={search}
              />
            </div>

            {/* File Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  النوع ({type || 'الكل'})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>نوع الملف</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`/admin/media?bucket=${bucket}`}>جميع الملفات</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/admin/media?bucket=${bucket}&type=image`}>صور فقط</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/admin/media?bucket=${bucket}&type=video`}>فيديو فقط</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {view === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a href={`/admin/media?bucket=${bucket}&view=grid`}>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    شبكة
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/admin/media?bucket=${bucket}&view=list`}>
                    <List className="mr-2 h-4 w-4" />
                    قائمة
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {buckets.map((b) => (
          <TabsContent key={b.id} value={b.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {b.name}
                </CardTitle>
                <CardDescription>{b.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MediaBrowserSkeleton />}>
                  <MediaBrowser 
                    bucket={b.id as any}
                    search={search}
                    type={type}
                    view={view}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

async function MediaStats() {
  // TODO: Implement actual stats from Supabase
  const stats = {
    totalFiles: 156,
    totalSize: '2.4 GB',
    imagesCount: 142,
    videosCount: 14
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الملفات</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFiles}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الحجم الكلي</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSize}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الصور</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.imagesCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ملفات أخرى</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.videosCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}

function MediaBrowserSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
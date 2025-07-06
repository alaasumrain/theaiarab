import { Suspense } from "react"
import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Folder, BarChart3, Settings } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import { ImageBrowser } from "@/components/admin/image-browser"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "إدارة الصور - لوحة التحكم",
  description: "إدارة جميع صور الموقع وتنظيمها حسب المجلدات"
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

export default function AdminImagesPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الصور</h1>
          <p className="text-muted-foreground">
            رفع وإدارة جميع صور الموقع من مكان واحد
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          مركز الصور
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">شعارات الأدوات</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              صور شعارات أدوات الذكاء الاصطناعي
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صور الأخبار</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              صور المقالات والأخبار
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صور الدروس</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              صور وأمثلة الدروس التعليمية
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ملفات الموقع</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              الصور العامة وملفات الموقع
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="browser" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            متصفح الصور
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            رفع صور جديدة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-6">
          <Suspense fallback={<LoadingGrid />}>
            <ImageBrowser />
          </Suspense>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ImageUpload />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إرشادات الرفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">الأنواع المدعومة:</h4>
                    <p className="text-muted-foreground">JPEG, PNG, WebP, GIF</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">الحد الأقصى للحجم:</h4>
                    <p className="text-muted-foreground">10 ميجابايت لكل صورة</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">المجلدات المتاحة:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• شعارات الأدوات: لصور شعارات الأدوات</li>
                      <li>• صور الأخبار: لصور المقالات والأخبار</li>
                      <li>• صور الدروس: لصور الدروس التعليمية</li>
                      <li>• ملفات الموقع: للصور العامة</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">نصائح الأداء:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• استخدم WebP للحصول على أفضل ضغط</li>
                      <li>• تجنب الأحجام الكبيرة جداً</li>
                      <li>• استخدم أسماء وصفية للملفات</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الاستخدام السريع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">بعد الرفع:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• انسخ رابط الصورة من متصفح الصور</li>
                      <li>• استخدم الرابط في المحتوى</li>
                      <li>• يمكن نسخ الصور بين المجلدات</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">إدارة الصور:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• عرض الشبكة أو القائمة</li>
                      <li>• البحث والفلترة</li>
                      <li>• حذف الصور غير المستخدمة</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
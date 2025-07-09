"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { createNews, updateNews } from "./actions"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface NewsArticle {
  id?: string
  title_ar: string
  title_en?: string
  content_ar?: string
  content_en?: string
  summary_ar?: string
  summary_en?: string
  author?: string
  category: string
  image_url?: string
  is_published: boolean
  is_featured: boolean
}

interface NewsFormProps {
  article?: NewsArticle
  isEdit?: boolean
}

const categories = [
  "تحديثات",
  "تعليم", 
  "أدوات",
  "أبحاث",
  "تحليل",
  "مقابلات",
  "تقارير"
]

export function NewsForm({ article, isEdit = false }: NewsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState<NewsArticle>({
    title_ar: article?.title_ar || "",
    title_en: article?.title_en || "",
    content_ar: article?.content_ar || "",
    content_en: article?.content_en || "",
    summary_ar: article?.summary_ar || "",
    summary_en: article?.summary_en || "",
    author: article?.author || "",
    category: article?.category || "تحديثات",
    image_url: article?.image_url || "",
    is_published: article?.is_published || false,
    is_featured: article?.is_featured || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEdit && article?.id) {
        await updateNews(article.id, formData)
      } else {
        await createNews(formData)
      }
      
      router.push('/admin/news')
      router.refresh()
    } catch (error) {
      console.error('Error saving article:', error)
      alert('حدث خطأ في حفظ المقال')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof NewsArticle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/news">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للقائمة
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="ml-2 h-4 w-4" />
            {previewMode ? 'تحرير' : 'معاينة'}
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="ml-2 h-4 w-4" />
            {isLoading ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'حفظ')}
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المحتوى الأساسي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان بالعربية *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => handleChange('title_ar', e.target.value)}
                    placeholder="عنوان المقال باللغة العربية"
                    required
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleChange('title_en', e.target.value)}
                    placeholder="Article title in English"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary_ar">الملخص بالعربية</Label>
                  <Textarea
                    id="summary_ar"
                    value={formData.summary_ar}
                    onChange={(e) => handleChange('summary_ar', e.target.value)}
                    placeholder="ملخص قصير للمقال باللغة العربية"
                    rows={3}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content_ar">المحتوى بالعربية *</Label>
                  <Textarea
                    id="content_ar"
                    value={formData.content_ar}
                    onChange={(e) => handleChange('content_ar', e.target.value)}
                    placeholder="محتوى المقال بصيغة Markdown..."
                    rows={20}
                    required
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground">
                    يمكنك استخدام Markdown للتنسيق (# للعناوين، **للنص الغامق**، إلخ)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النشر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">المؤلف</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="اسم المؤلف"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">نشر المقال</Label>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => handleChange('is_published', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">مقال مميز</Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleChange('is_featured', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>معاينة المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="space-y-6">
              <header>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  {formData.title_ar}
                </h1>
                {formData.title_en && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {formData.title_en}
                  </p>
                )}
                {formData.summary_ar && (
                  <div className="bg-muted/50 p-6 rounded-lg mb-6">
                    <p className="text-lg leading-relaxed">
                      {formData.summary_ar}
                    </p>
                  </div>
                )}
              </header>
              
              {formData.content_ar && (
                <MarkdownRenderer content={formData.content_ar} />
              )}
            </article>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Save, Eye, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Textarea component - using regular textarea for now
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductLogo } from "@/components/product-logo"
import { ImageBrowser } from "@/components/admin/image-browser"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { updateProduct } from "./actions"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  codename: string
  arabic_name?: string
  punchline: string
  arabic_description?: string
  description: string
  categories: string
  approved: boolean
  view_count: number
  created_at: string
  updated_at?: string
  logo_src?: string
  product_website?: string
  is_free?: boolean
  difficulty_level?: string
}

interface ProductEditFormProps {
  product: Product
}

const AI_CATEGORIES = [
  'text-generation',
  'image-generation', 
  'video-generation',
  'code-assistant',
  'productivity',
  'design',
  'search-engine',
  'ai-writing',
  'ai-audio',
  'chatbot',
  'voice-assistant',
  'document'
]

const DIFFICULTY_LEVELS = ['مبتدئ', 'متوسط', 'متقدم']

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [logoDialogOpen, setLogoDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    codename: product.codename,
    arabic_name: product.arabic_name || '',
    punchline: product.punchline,
    arabic_description: product.arabic_description || '',
    description: product.description,
    categories: product.categories,
    product_website: product.product_website || '',
    is_free: product.is_free || false,
    difficulty_level: product.difficulty_level || '',
    approved: product.approved,
    logo_src: product.logo_src || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProduct(product.id, formData)
      if (result.success) {
        toast.success('تم تحديث الأداة بنجاح')
        router.push('/admin/products')
      } else {
        toast.error(result.error || 'حدث خطأ في التحديث')
      }
    } catch (error) {
      toast.error('حدث خطأ في التحديث')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, logo_src: imageUrl }))
    setLogoDialogOpen(false)
    toast.success('تم تحديد الشعار')
  }

  const handleLogoUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, logo_src: urls[0] }))
      setLogoDialogOpen(false)
      toast.success('تم رفع الشعار وتحديده بنجاح! 🎉')
    }
  }

  const handleLogoUploadError = (errors: string[]) => {
    toast.error(`فشل في رفع الشعار: ${errors.join(', ')}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            شعار الأداة
          </CardTitle>
          <CardDescription>
            رفع أو اختيار شعار للأداة - الأبعاد المُوصى بها: 200×200 بكسل أو أكبر (مربع الشكل)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo Preview with immediate feedback */}
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProductLogo 
                  logo_src={formData.logo_src}
                  codename={formData.codename}
                  arabic_name={formData.arabic_name}
                  size="lg"
                />
                {formData.logo_src && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {formData.logo_src ? '✅ شعار مخصص نشط' : '🎯 أيقونة افتراضية'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.logo_src 
                    ? 'يتم عرض الشعار المخصص في الموقع' 
                    : 'سيتم عرض أيقونة افتراضية حسب الفئة'
                  }
                </p>
                {formData.logo_src && (
                  <p className="text-xs text-blue-600 mt-1 font-mono">
                    {formData.logo_src.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {formData.logo_src ? 'تغيير الشعار' : 'إضافة شعار'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>إدارة شعار الأداة</DialogTitle>
                  <DialogDescription>
                    رفع شعار جديد أو اختيار من المكتبة الموجودة
                  </DialogDescription>
                </DialogHeader>
                
                {/* Dimension Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">📐 متطلبات الشعار:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• <strong>الأبعاد المُوصى بها:</strong> 200×200 بكسل أو أكبر (مربع الشكل)</li>
                    <li>• <strong>الحد الأقصى:</strong> 10 ميجابايت</li>
                    <li>• <strong>الصيغ المدعومة:</strong> PNG, JPEG, WebP, SVG</li>
                    <li>• <strong>نصيحة:</strong> استخدم خلفية شفافة (PNG) للحصول على أفضل النتائج</li>
                  </ul>
                </div>

                <div className="max-h-[50vh] overflow-y-auto">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">⬆️ رفع شعار جديد</TabsTrigger>
                      <TabsTrigger value="browse">📁 تصفح المكتبة</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                      <ImageUpload
                        bucketId="product-logos"
                        onUploadComplete={handleLogoUpload}
                        onUploadError={handleLogoUploadError}
                        maxFiles={1}
                        acceptedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                        className="border-dashed border-2 border-primary/30"
                        autoUpload={true}
                      />
                    </TabsContent>
                    <TabsContent value="browse" className="mt-4">
                      <ImageBrowser
                        bucketFilter="product-logos"
                        selectionMode={true}
                        onImageSelect={(image) => handleLogoSelect(image.public_url)}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>

            {formData.logo_src && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, logo_src: '' }))
                  toast.success('تم إزالة الشعار - سيتم عرض الأيقونة الافتراضية')
                }}
              >
                إزالة الشعار
              </Button>
            )}
          </div>

          {/* Logo URL Input with validation */}
          <div className="space-y-2">
            <Label htmlFor="logo_src">رابط الشعار المباشر (اختياري)</Label>
            <Input
              id="logo_src"
              value={formData.logo_src}
              onChange={(e) => {
                const url = e.target.value
                setFormData(prev => ({ ...prev, logo_src: url }))
                // Basic URL validation feedback
                if (url && !url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) && url.startsWith('http')) {
                  toast.warning('تأكد من أن الرابط ينتهي بامتداد صورة صحيح (.png, .jpg, إلخ)')
                }
              }}
              placeholder="https://example.com/logo.png"
              dir="ltr"
              className={cn(
                formData.logo_src && !formData.logo_src.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) && formData.logo_src.startsWith('http')
                  ? 'border-yellow-500 focus:ring-yellow-500' 
                  : ''
              )}
            />
            <p className="text-xs text-muted-foreground">
              يمكنك لصق رابط صورة مباشر من الإنترنت أو استخدام "رفع شعار جديد" أعلاه
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codename">اسم الأداة بالإنجليزية *</Label>
              <Input
                id="codename"
                value={formData.codename}
                onChange={(e) => setFormData(prev => ({ ...prev, codename: e.target.value }))}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arabic_name">الاسم بالعربية</Label>
              <Input
                id="arabic_name"
                value={formData.arabic_name}
                onChange={(e) => setFormData(prev => ({ ...prev, arabic_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="punchline">الوصف المختصر *</Label>
            <Input
              id="punchline"
              value={formData.punchline}
              onChange={(e) => setFormData(prev => ({ ...prev, punchline: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arabic_description">الوصف بالعربية</Label>
            <textarea
              id="arabic_description"
              value={formData.arabic_description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, arabic_description: e.target.value }))}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف بالإنجليزية *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              dir="ltr"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_website">الموقع الرسمي</Label>
            <Input
              id="product_website"
              value={formData.product_website}
              onChange={(e) => setFormData(prev => ({ ...prev, product_website: e.target.value }))}
              placeholder="https://example.com"
              dir="ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories and Properties */}
      <Card>
        <CardHeader>
          <CardTitle>التصنيف والخصائص</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categories">الفئة *</Label>
              <Select value={formData.categories} onValueChange={(value) => setFormData(prev => ({ ...prev, categories: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {AI_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">مستوى الصعوبة</Label>
              <Select value={formData.difficulty_level} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="is_free"
              checked={formData.is_free}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked as boolean }))}
            />
            <Label htmlFor="is_free">أداة مجانية</Label>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="approved"
              checked={formData.approved}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, approved: checked as boolean }))}
            />
            <Label htmlFor="approved">معتمدة للنشر</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
        
        <Button type="button" variant="outline" asChild>
          <a href={`/products/${product.id}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            معاينة
          </a>
        </Button>
      </div>
    </form>
  )
} 
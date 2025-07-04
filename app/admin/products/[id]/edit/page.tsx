import { notFound } from "next/navigation"
import { createClient } from "@/db/supabase/server"
import { ProductEditForm } from "./product-edit-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة للأدوات
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              تعديل {product.arabic_name || product.codename}
            </h1>
            <p className="text-muted-foreground">
              تحديث معلومات الأداة والشعار
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductEditForm product={product} />
        </div>
        
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات الأداة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="font-medium">المعرف:</span>
                <p className="text-muted-foreground font-mono">{product.id}</p>
              </div>
              <div>
                <span className="font-medium">المشاهدات:</span>
                <p className="text-muted-foreground">{product.view_count || 0}</p>
              </div>
              <div>
                <span className="font-medium">تاريخ الإنشاء:</span>
                <p className="text-muted-foreground">
                  {new Date(product.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              {product.updated_at && (
                <div>
                  <span className="font-medium">آخر تحديث:</span>
                  <p className="text-muted-foreground">
                    {new Date(product.updated_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/products/${product.id}`} target="_blank">
                  عرض الأداة
                </Link>
              </Button>
              {product.product_website && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={product.product_website} target="_blank">
                    زيارة الموقع الرسمي
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
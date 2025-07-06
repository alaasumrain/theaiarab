"use client"

import { useState } from "react"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { updateProductLogo } from "@/app/admin/products/actions"

interface QuickLogoUploadProps {
  productId: string
  productName: string
  currentLogoSrc?: string
  onLogoUpdated?: (newLogoSrc: string) => void
}

export function QuickLogoUpload({ 
  productId, 
  productName, 
  currentLogoSrc,
  onLogoUpdated 
}: QuickLogoUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLogoUpload = async (urls: string[]) => {
    if (urls.length === 0) return
    
    setIsUpdating(true)
    try {
      const result = await updateProductLogo(productId, urls[0])
      if (result.success) {
        toast.success(`تم تحديث شعار ${productName} بنجاح! 🎉`)
        onLogoUpdated?.(urls[0])
        setIsOpen(false)
      } else {
        toast.error(result.error || 'فشل في تحديث الشعار')
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث الشعار')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogoUploadError = (errors: string[]) => {
    toast.error(`فشل في رفع الشعار: ${errors.join(', ')}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 hover:bg-primary/10"
          title={currentLogoSrc ? 'تغيير الشعار' : 'إضافة شعار'}
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Upload className="h-3 w-3" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {currentLogoSrc ? 'تغيير شعار' : 'إضافة شعار'} {productName}
          </DialogTitle>
          <DialogDescription>
            رفع شعار جديد للأداة - سيتم الرفع تلقائياً عند اختيار الملف
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Logo Preview */}
          {currentLogoSrc && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <img 
                src={currentLogoSrc} 
                alt={productName}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <p className="text-sm font-medium">الشعار الحالي</p>
                <p className="text-xs text-muted-foreground">
                  {currentLogoSrc.split('/').pop()}
                </p>
              </div>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-sm">📐 متطلبات الشعار:</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5">
              <li>• <strong>الأبعاد:</strong> 200×200 بكسل أو أكبر (مربع)</li>
              <li>• <strong>الحجم:</strong> حتى 10 ميجابايت</li>
              <li>• <strong>الصيغ:</strong> PNG, JPEG, WebP, SVG</li>
            </ul>
          </div>

          {/* Quick Upload */}
          <ImageUpload
            bucketId="product-logos"
            onUploadComplete={handleLogoUpload}
            onUploadError={handleLogoUploadError}
            maxFiles={1}
            acceptedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
            autoUpload={true}
            className="border-dashed border-2 border-primary/30"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 
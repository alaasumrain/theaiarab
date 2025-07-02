"use client"

import { useState } from "react"
import { 
  MoreHorizontal, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Star, 
  StarOff, 
  Trash2,
  Eye,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { approveProduct, rejectProduct, toggleFeatured, deleteProduct } from "./actions"

interface Product {
  id: string
  codename: string
  arabic_name?: string
  approved: boolean
  featured?: boolean
  product_website?: string
}

export function ProductActions({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await approveProduct(product.id)
      toast.success(`تم اعتماد ${product.arabic_name || product.codename} بنجاح`)
    } catch (error) {
      toast.error("حدث خطأ في اعتماد الأداة")
    }
    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectProduct(product.id)
      toast.success(`تم رفض ${product.arabic_name || product.codename}`)
    } catch (error) {
      toast.error("حدث خطأ في رفض الأداة")
    }
    setIsLoading(false)
  }

  const handleToggleFeatured = async () => {
    setIsLoading(true)
    try {
      await toggleFeatured(product.id, !product.featured)
      toast.success(`${product.arabic_name || product.codename} ${product.featured ? 'لم تعد مميزة' : 'أصبحت مميزة'}`)
    } catch (error) {
      toast.error("حدث خطأ في تغيير حالة التمييز")
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm(`هل أنت متأكد من حذف "${product.arabic_name || product.codename}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      return
    }
    
    setIsLoading(true)
    try {
      await deleteProduct(product.id)
      toast.success(`تم حذف ${product.arabic_name || product.codename}`)
    } catch (error) {
      toast.error("حدث خطأ في حذف الأداة")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick Status Actions */}
      {!product.approved && (
        <Button 
          size="sm" 
          onClick={handleApprove}
          disabled={isLoading}
          className="h-8 px-2"
        >
          <CheckCircle className="h-3 w-3" />
        </Button>
      )}
      
      {product.approved && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleReject}
          disabled={isLoading}
          className="h-8 px-2"
        >
          <XCircle className="h-3 w-3" />
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>إجراءات الأداة</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href={`/products/${product.id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              عرض الأداة
            </Link>
          </DropdownMenuItem>
          
          {product.product_website && (
            <DropdownMenuItem asChild>
              <Link href={product.product_website} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                زيارة الموقع
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              تعديل
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleToggleFeatured} disabled={isLoading}>
            {product.featured ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                إزالة التمييز
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                تمييز الأداة
              </>
            )}
          </DropdownMenuItem>
          
          {!product.approved && (
            <DropdownMenuItem onClick={handleApprove} disabled={isLoading}>
              <CheckCircle className="mr-2 h-4 w-4" />
              اعتماد
            </DropdownMenuItem>
          )}
          
          {product.approved && (
            <DropdownMenuItem onClick={handleReject} disabled={isLoading}>
              <XCircle className="mr-2 h-4 w-4" />
              رفض
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="mr-2 h-4 w-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
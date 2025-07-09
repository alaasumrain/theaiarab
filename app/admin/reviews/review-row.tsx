"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Star, 
  StarOff,
  Trash2,
  Flag,
  Eye,
  Edit
} from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { toggleReviewFeatured, deleteReview } from "../actions"

interface ReviewRowProps {
  review: {
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
}

export function ReviewRow({ review }: ReviewRowProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleFeatured = async () => {
    setIsLoading(true)
    try {
      const result = await toggleReviewFeatured(
        review.id, 
        review.type, 
        !review.is_featured
      )
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          review.is_featured 
            ? 'تم إلغاء تمييز التقييم' 
            : 'تم تمييز التقييم'
        )
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث التقييم')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return
    
    setIsLoading(true)
    try {
      const result = await deleteReview(review.id, review.type)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('تم حذف التقييم بنجاح')
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف التقييم')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {review.user_name || review.user_email || 'مجهول'}
            </span>
            <Badge variant="outline" className="text-xs">
              {review.type === 'user' ? 'مستخدم' : 'عام'}
            </Badge>
            {review.is_featured && (
              <Badge variant="default" className="text-xs">
                مميز
              </Badge>
            )}
          </div>
          {review.user_email && review.user_name && (
            <span className="text-sm text-muted-foreground">{review.user_email}</span>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-sm font-medium">{review.product_name}</span>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-muted-foreground">
            {review.rating}/5
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="max-w-xs">
          <p className="text-sm line-clamp-2 text-right">
            {review.comment}
          </p>
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-sm">
          {format(new Date(review.created_at), 'dd MMM yyyy', { locale: ar })}
        </span>
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isLoading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <button
                onClick={() => router.push(`/admin/reviews/${review.type}/${review.id}`)}
                className="w-full flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                عرض التفاصيل
              </button>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <button
                onClick={handleToggleFeatured}
                className="w-full flex items-center"
                disabled={isLoading}
              >
                {review.is_featured ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    إلغاء التمييز
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    تمييز التقييم
                  </>
                )}
              </button>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <button
                onClick={handleDelete}
                className="w-full flex items-center text-red-600"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف التقييم
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
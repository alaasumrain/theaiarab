"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Mail, 
  UserX,
  UserCheck,
  Trash2
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
import { toggleSubscriberStatus, deleteSubscriber } from "../actions"

interface SubscriberRowProps {
  subscriber: {
    id: string
    email: string
    subscribed_at: string
    is_active: boolean
    user_id?: string
    username?: string
  }
}

export function SubscriberRow({ subscriber }: SubscriberRowProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleStatus = async () => {
    setIsLoading(true)
    try {
      const result = await toggleSubscriberStatus(subscriber.id, !subscriber.is_active)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          subscriber.is_active 
            ? 'تم إلغاء تفعيل المشترك' 
            : 'تم تفعيل المشترك'
        )
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة المشترك')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المشترك؟')) return
    
    setIsLoading(true)
    try {
      const result = await deleteSubscriber(subscriber.id)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('تم حذف المشترك بنجاح')
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف المشترك')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{subscriber.email}</span>
          <span className="text-sm text-muted-foreground">
            #{subscriber.id.slice(0, 8)}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant={subscriber.is_active ? 'success' : 'secondary'}>
          {subscriber.is_active ? 'نشط' : 'غير نشط'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <span className="text-sm">
          {format(new Date(subscriber.subscribed_at), 'dd MMM yyyy', { locale: ar })}
        </span>
      </TableCell>
      
      <TableCell>
        {subscriber.username ? (
          <span className="text-sm">@{subscriber.username}</span>
        ) : (
          <span className="text-sm text-muted-foreground">زائر</span>
        )}
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
                onClick={() => window.location.href = `mailto:${subscriber.email}`}
                className="w-full flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                إرسال بريد إلكتروني
              </button>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <button
                onClick={handleToggleStatus}
                className="w-full flex items-center"
                disabled={isLoading}
              >
                {subscriber.is_active ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    إلغاء التفعيل
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    تفعيل الاشتراك
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
                حذف المشترك
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
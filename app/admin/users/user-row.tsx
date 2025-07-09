"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Edit, 
  Shield, 
  UserX,
  Eye,
  Mail,
  Heart,
  MessageSquare,
  Activity
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
import { toggleUserRole } from "../actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserRowProps {
  user: {
    id: string
    email: string
    username?: string
    role: 'user' | 'admin'
    created_at: string
    last_sign_in_at?: string
    favorites_count?: number
    reviews_count?: number
    views_count?: number
  }
}

export function UserRow({ user }: UserRowProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleRole = async () => {
    setIsLoading(true)
    try {
      const result = await toggleUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          user.role === 'admin' 
            ? 'تم إلغاء صلاحيات المدير بنجاح' 
            : 'تم منح صلاحيات المدير بنجاح'
        )
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الصلاحيات')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{user.email}</span>
          {user.username && (
            <span className="text-sm text-muted-foreground">@{user.username}</span>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' ? 'مدير' : 'مستخدم'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <span className="text-sm">
          {format(new Date(user.created_at), 'dd MMM yyyy', { locale: ar })}
        </span>
      </TableCell>
      
      <TableCell>
        {user.last_sign_in_at ? (
          <span className="text-sm">
            {format(new Date(user.last_sign_in_at), 'dd MMM yyyy', { locale: ar })}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">لم يسجل دخول</span>
        )}
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span className="text-sm">{user.favorites_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>المفضلات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-sm">{user.reviews_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>التقييمات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="text-sm">{user.views_count || 0}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>المشاهدات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
                onClick={() => window.location.href = `mailto:${user.email}`}
                className="w-full flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                إرسال بريد إلكتروني
              </button>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <button
                onClick={handleToggleRole}
                className="w-full flex items-center"
                disabled={isLoading}
              >
                <Shield className="mr-2 h-4 w-4" />
                {user.role === 'admin' ? 'إلغاء صلاحيات المدير' : 'منح صلاحيات المدير'}
              </button>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <button
                onClick={() => router.push(`/admin/users/${user.id}`)}
                className="w-full flex items-center"
              >
                <Activity className="mr-2 h-4 w-4" />
                عرض النشاط
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Send,
  Trash2,
  Calendar,
  Pause
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
import { deleteCampaign, sendCampaign } from "../actions"

interface CampaignRowProps {
  campaign: {
    id: string
    name: string
    subject: string
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
    scheduled_for?: string
    sent_at?: string
    recipient_count: number
    open_count: number
    click_count: number
    created_at: string
    created_by: string
    creator_email?: string
  }
}

const statusLabels = {
  draft: 'مسودة',
  scheduled: 'مجدولة',
  sending: 'جاري الإرسال',
  sent: 'مرسلة',
  cancelled: 'ملغاة'
}

const statusColors = {
  draft: 'secondary',
  scheduled: 'default',
  sending: 'warning',
  sent: 'success',
  cancelled: 'destructive'
} as const

export function CampaignRow({ campaign }: CampaignRowProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSend = async () => {
    if (!confirm('هل أنت متأكد من إرسال هذه الحملة؟')) return
    
    setIsLoading(true)
    try {
      const result = await sendCampaign(campaign.id)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('تم إرسال الحملة بنجاح')
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الحملة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الحملة؟')) return
    
    setIsLoading(true)
    try {
      const result = await deleteCampaign(campaign.id)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('تم حذف الحملة بنجاح')
        router.refresh()
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الحملة')
    } finally {
      setIsLoading(false)
    }
  }

  const openRate = campaign.recipient_count > 0 
    ? ((campaign.open_count / campaign.recipient_count) * 100).toFixed(1) 
    : '0'

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{campaign.name}</span>
          <span className="text-sm text-muted-foreground">{campaign.subject}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant={statusColors[campaign.status]}>
          {statusLabels[campaign.status]}
        </Badge>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{campaign.recipient_count}</span>
          <span className="text-xs text-muted-foreground">مستلم</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{openRate}%</span>
          <span className="text-xs text-muted-foreground">
            {campaign.open_count} فتح
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          {campaign.sent_at ? (
            <>
              <span className="text-sm">
                {format(new Date(campaign.sent_at), 'dd MMM yyyy', { locale: ar })}
              </span>
              <span className="text-xs text-muted-foreground">تم الإرسال</span>
            </>
          ) : campaign.scheduled_for ? (
            <>
              <span className="text-sm">
                {format(new Date(campaign.scheduled_for), 'dd MMM yyyy', { locale: ar })}
              </span>
              <span className="text-xs text-muted-foreground">مجدولة</span>
            </>
          ) : (
            <>
              <span className="text-sm">
                {format(new Date(campaign.created_at), 'dd MMM yyyy', { locale: ar })}
              </span>
              <span className="text-xs text-muted-foreground">تم الإنشاء</span>
            </>
          )}
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
                onClick={() => router.push(`/admin/newsletter/campaigns/${campaign.id}`)}
                className="w-full flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                عرض التفاصيل
              </button>
            </DropdownMenuItem>
            
            {campaign.status === 'draft' && (
              <>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => router.push(`/admin/newsletter/campaigns/${campaign.id}/edit`)}
                    className="w-full flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل الحملة
                  </button>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleSend}
                    className="w-full flex items-center"
                    disabled={isLoading}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    إرسال الآن
                  </button>
                </DropdownMenuItem>
              </>
            )}
            
            {campaign.status === 'scheduled' && (
              <DropdownMenuItem asChild>
                <button
                  onClick={() => {/* Handle pause/cancel */}}
                  className="w-full flex items-center"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  إلغاء الجدولة
                </button>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <button
                onClick={handleDelete}
                className="w-full flex items-center text-red-600"
                disabled={isLoading || campaign.status === 'sent'}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف الحملة
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
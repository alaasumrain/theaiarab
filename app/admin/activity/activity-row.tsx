"use client"

import { 
  Package, 
  User, 
  FileText, 
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Plus,
  Eye
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import {
  TableCell,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActivityRowProps {
  log: {
    id: string
    admin_id: string
    admin_email?: string
    admin_username?: string
    action: string
    resource_type: string
    resource_id?: string
    details?: any
    created_at: string
  }
}

const actionIcons: Record<string, any> = {
  'create': Plus,
  'update': Edit,
  'delete': Trash,
  'approve': CheckCircle,
  'reject': XCircle,
  'view': Eye,
  'update_user_role': Shield,
  'approve_product': CheckCircle,
  'reject_product': XCircle,
  'delete_product': Trash,
}

const resourceIcons: Record<string, any> = {
  'product': Package,
  'user': User,
  'news': FileText,
  'tutorial': FileText,
}

const actionLabels: Record<string, string> = {
  'create': 'إنشاء',
  'update': 'تحديث',
  'delete': 'حذف',
  'approve': 'موافقة',
  'reject': 'رفض',
  'view': 'عرض',
  'update_user_role': 'تحديث صلاحيات',
  'approve_product': 'الموافقة على منتج',
  'reject_product': 'رفض منتج',
  'delete_product': 'حذف منتج',
}

const resourceLabels: Record<string, string> = {
  'product': 'منتج',
  'user': 'مستخدم',
  'news': 'خبر',
  'tutorial': 'درس',
}

export function ActivityRow({ log }: ActivityRowProps) {
  const ActionIcon = actionIcons[log.action] || Edit
  const ResourceIcon = resourceIcons[log.resource_type] || FileText
  const actionLabel = actionLabels[log.action] || log.action
  const resourceLabel = resourceLabels[log.resource_type] || log.resource_type

  return (
    <TableRow>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground cursor-help">
                {formatDistanceToNow(new Date(log.created_at), { 
                  addSuffix: true, 
                  locale: ar 
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(new Date(log.created_at), 'PPpp', { locale: ar })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {log.admin_username || log.admin_email?.split('@')[0]}
          </span>
          <span className="text-xs text-muted-foreground">{log.admin_email}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <ActionIcon className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline">{actionLabel}</Badge>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <ResourceIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{resourceLabel}</span>
          {log.resource_id && (
            <span className="text-xs text-muted-foreground">
              #{log.resource_id.slice(0, 8)}
            </span>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        {log.details && Object.keys(log.details).length > 0 && (
          <div className="text-sm">
            {log.action === 'update_user_role' && log.details.new_role && (
              <Badge variant={log.details.new_role === 'admin' ? 'default' : 'secondary'}>
                {log.details.new_role === 'admin' ? 'مدير' : 'مستخدم'}
              </Badge>
            )}
            {log.details.approved !== undefined && (
              <Badge variant={log.details.approved ? 'success' : 'destructive'}>
                {log.details.approved ? 'معتمد' : 'مرفوض'}
              </Badge>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}
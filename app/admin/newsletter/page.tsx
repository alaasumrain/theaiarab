import { Suspense } from "react"
import { 
  Mail, 
  Search, 
  Filter,
  Users,
  Send,
  TrendingUp,
  Calendar,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriberRow } from "./subscriber-row"
import { CampaignRow } from "./campaign-row"

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
  user_id?: string
  username?: string
}

interface Campaign {
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

async function getSubscribers(
  searchTerm?: string,
  filter?: string
): Promise<Subscriber[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('newsletter_subscribers')
    .select(`
      *,
      user:users!user_id (
        username
      )
    `)

  // Apply search filter
  if (searchTerm) {
    query = query.ilike('email', `%${searchTerm}%`)
  }

  // Apply status filter
  if (filter === 'active') {
    query = query.eq('is_active', true)
  } else if (filter === 'inactive') {
    query = query.eq('is_active', false)
  }

  query = query.order('subscribed_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching subscribers:', error)
    return []
  }

  return (data || []).map(sub => ({
    id: sub.id,
    email: sub.email,
    subscribed_at: sub.subscribed_at,
    is_active: sub.is_active,
    user_id: sub.user_id,
    username: sub.user?.username
  }))
}

async function getCampaigns(): Promise<Campaign[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('email_campaigns')
    .select(`
      *,
      creator:users!created_by (
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }

  return (data || []).map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    subject: campaign.subject,
    status: campaign.status,
    scheduled_for: campaign.scheduled_for,
    sent_at: campaign.sent_at,
    recipient_count: campaign.recipient_count,
    open_count: campaign.open_count,
    click_count: campaign.click_count,
    created_at: campaign.created_at,
    created_by: campaign.created_by,
    creator_email: campaign.creator?.email
  }))
}

export default async function NewsletterManagement({
  searchParams,
}: {
  searchParams: {
    search?: string
    filter?: string
    tab?: string
  }
}) {
  const { search, filter, tab = 'subscribers' } = searchParams
  
  const [subscribers, campaigns] = await Promise.all([
    getSubscribers(search, filter),
    getCampaigns()
  ])

  const subscriberStats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.is_active).length,
    inactive: subscribers.filter(s => !s.is_active).length,
    thisMonth: subscribers.filter(s => {
      const subDate = new Date(s.subscribed_at)
      const now = new Date()
      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear()
    }).length
  }

  const campaignStats = {
    total: campaigns.length,
    sent: campaigns.filter(c => c.status === 'sent').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة النشرة البريدية</h1>
          <p className="text-muted-foreground">
            إدارة المشتركين والحملات البريدية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/newsletter/export">
              <Download className="h-4 w-4 ml-2" />
              تصدير المشتركين
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/newsletter/create">
              <Plus className="h-4 w-4 ml-2" />
              إنشاء حملة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشتركين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {subscriberStats.active} نشط
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشتركين جدد</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{subscriberStats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحملات المرسلة</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{campaignStats.sent}</div>
            <p className="text-xs text-muted-foreground">
              {campaignStats.draft} مسودة
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحملات المجدولة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{campaignStats.scheduled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">المشتركون</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribers" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث بالبريد الإلكتروني..."
                      defaultValue={search}
                      className="pr-10"
                    />
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      تصفية ({filter || 'الكل'})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>حالة الاشتراك</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/newsletter">جميع المشتركين</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/newsletter?filter=active">النشطون فقط</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/newsletter?filter=inactive">غير النشطين</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المشتركين</CardTitle>
              <CardDescription>
                {subscribers.length} مشترك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الاشتراك</TableHead>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.length > 0 ? (
                    subscribers.map((subscriber) => (
                      <SubscriberRow key={subscriber.id} subscriber={subscriber} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        لا يوجد مشتركون يطابقون معايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          {/* Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>الحملات البريدية</CardTitle>
              <CardDescription>
                {campaigns.length} حملة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الحملة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المستلمون</TableHead>
                    <TableHead>معدل الفتح</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <CampaignRow key={campaign.id} campaign={campaign} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        لا توجد حملات بريدية
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
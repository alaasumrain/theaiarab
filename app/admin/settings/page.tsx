import { Suspense } from "react"
import { 
  Settings,
  Globe,
  Mail,
  Shield,
  Palette,
  Database,
  Zap,
  Save,
  RotateCcw
} from "lucide-react"

import { createClient } from "@/db/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SettingsForm } from "./settings-form"

interface SiteSetting {
  id: number
  key: string
  value: any
  description: string
  category: string
  is_sensitive: boolean
}

async function getSettings(): Promise<Record<string, SiteSetting>> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('category', { ascending: true })
    .then(result => result)

  if (error) {
    console.error('Error fetching settings:', error)
    return {}
  }

  // Convert array to object for easier access
  return (data || []).reduce((acc, setting) => {
    acc[setting.key] = setting
    return acc
  }, {} as Record<string, SiteSetting>)
}

export default async function SettingsPage() {
  const settings = await getSettings()

  const categories = [
    {
      id: 'general',
      title: 'الإعدادات العامة',
      description: 'إعدادات أساسية للموقع',
      icon: Globe,
      keys: ['site_name', 'site_name_ar', 'site_description', 'site_description_ar', 'default_language']
    },
    {
      id: 'contact',
      title: 'معلومات الاتصال',
      description: 'بيانات التواصل والإتصال',
      icon: Mail,
      keys: ['contact_email']
    },
    {
      id: 'social',
      title: 'وسائل التواصل الاجتماعي',
      description: 'حسابات وسائل التواصل الاجتماعي',
      icon: Shield,
      keys: ['social_twitter', 'social_linkedin']
    },
    {
      id: 'features',
      title: 'الميزات',
      description: 'تفعيل وإلغاء تفعيل الميزات',
      icon: Zap,
      keys: ['analytics_enabled', 'newsletter_enabled', 'reviews_enabled', 'auto_approve_products', 'maintenance_mode']
    },
    {
      id: 'display',
      title: 'إعدادات العرض',
      description: 'إعدادات العرض والتخطيط',
      icon: Palette,
      keys: ['items_per_page', 'default_language']
    },
    {
      id: 'email',
      title: 'إعدادات البريد الإلكتروني',
      description: 'إعدادات خادم البريد الإلكتروني',
      icon: Mail,
      keys: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_from_email', 'smtp_from_name'],
      sensitive: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
          <p className="text-muted-foreground">
            إدارة إعدادات الموقع والنظام
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 ml-2" />
            استعادة الافتراضي
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 ml-2" />
            حفظ جميع التغييرات
          </Button>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid gap-6">
        {categories.map((category) => {
          const CategoryIcon = category.icon
          const categorySettings = category.keys.reduce((acc, key) => {
            if (settings[key]) {
              acc[key] = settings[key]
            }
            return acc
          }, {} as Record<string, SiteSetting>)

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5" />
                  <CardTitle>{category.title}</CardTitle>
                  {category.sensitive && (
                    <Badge variant="outline" className="text-xs">
                      حساس
                    </Badge>
                  )}
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm 
                  settings={categorySettings}
                  category={category.id}
                  sensitive={category.sensitive}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>معلومات النظام</CardTitle>
          </div>
          <CardDescription>معلومات حول حالة النظام والإحصائيات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">إصدار النظام</Label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">آخر تحديث</Label>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('ar-SA')}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">حالة قاعدة البيانات</Label>
              <Badge variant="success">متصل</Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">حالة التخزين</Label>
              <Badge variant="success">نشط</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
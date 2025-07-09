import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { 
  BarChart3, 
  Users, 
  Settings, 
  Package, 
  Home,
  Crown,
  Shield,
  Activity,
  Images,
  Newspaper,
  Mail,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

import { createClient } from "@/db/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/app/providers"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createClient()
  
  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  // Check admin role
  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'admin') {
    redirect('/')
  }

  const navigationItems = [
    {
      name: "لوحة التحكم",
      href: "/admin",
      icon: BarChart3,
      description: "إحصائيات وملخص عام"
    },
    {
      name: "إدارة الأدوات",
      href: "/admin/products",
      icon: Package,
      description: "مراجعة وإدارة أدوات الذكاء الاصطناعي"
    },
    {
      name: "إدارة الأخبار",
      href: "/admin/news",
      icon: Newspaper,
      description: "إنشاء وتحرير مقالات الأخبار والمحتوى"
    },
    {
      name: "مكتبة الوسائط",
      href: "/admin/media",
      icon: Images,
      description: "إدارة وتنظيم الصور والملفات"
    },
    {
      name: "إدارة المستخدمين",
      href: "/admin/users",
      icon: Users,
      description: "إدارة المستخدمين والصلاحيات"
    },
    {
      name: "إدارة النشرة البريدية",
      href: "/admin/newsletter",
      icon: Mail,
      description: "إدارة المشتركين والحملات البريدية"
    },
    {
      name: "مراجعة التقييمات",
      href: "/admin/reviews",
      icon: MessageSquare,
      description: "مراجعة وإدارة تقييمات المستخدمين"
    },
    {
      name: "سجل النشاطات",
      href: "/admin/activity",
      icon: Activity,
      description: "مراقبة نشاطات الإدارة"
    },
    {
      name: "الإعدادات",
      href: "/admin/settings",
      icon: Settings,
      description: "إعدادات النظام العامة"
    }
  ]

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Logo and Admin Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">العربي للذكاء الاصطناعي</span>
            </Link>
            <Badge variant="default" className="gap-1">
              <Shield className="h-3 w-3" />
              لوحة الإدارة
            </Badge>
          </div>

          <div className="flex-1" />

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Admin User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userData.full_name?.charAt(0) || user.email?.charAt(0) || 'أ'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData.full_name || 'مدير النظام'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>العودة للموقع</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="w-full text-right">
                    تسجيل الخروج
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 border-l bg-card h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex flex-col gap-2 p-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground hidden lg:block">
                    {item.description}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
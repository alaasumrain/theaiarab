"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Brain, 
  Search, 
  Menu, 
  X,
  Home,
  Package,
  BookOpen,
  Newspaper,
  Plus,
  PanelRightOpen,
  PanelRightClose
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/app/providers"
import { useSidebar } from "@/contexts/sidebar-context"

const navigation = [
  {
    name: "الرئيسية",
    href: "/",
    icon: Home
  },
  {
    name: "الأدوات", 
    href: "/tools",
    icon: Package
  },
  {
    name: "التعلم",
    href: "/tutorials", 
    icon: BookOpen
  },
  {
    name: "الأخبار",
    href: "/news",
    icon: Newspaper
  },
  {
    name: "أضف أداة",
    href: "/submit",
    icon: Plus
  }
]

export function TopNavbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Don't show navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  // Use the sidebar context with fallback
  let sidebarOpen = true
  let toggleSidebar = () => {}
  try {
    const sidebar = useSidebar()
    sidebarOpen = sidebar.isOpen
    toggleSidebar = sidebar.toggle
  } catch (error) {
    console.warn("Sidebar context not available in TopNavbar")
  }

  // Show sidebar toggle only on pages that have sidebar
  const showSidebarToggle = !['/login', '/login/password'].includes(pathname) && 
    !pathname.startsWith('/admin')

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-[#FAFAFA]/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAFAFA]/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Sidebar Toggle - Desktop */}
        {showSidebarToggle && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 ml-2 hover:bg-accent transition-all duration-150 ease-in-out"
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
            <span className="sr-only">تبديل الشريط الجانبي</span>
          </Button>
        )}

        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-all duration-150 ease-in-out transform hover:scale-105"
        >
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          <span className="hidden sm:inline">العربي للذكاء الاصطناعي</span>
          <span className="sm:hidden">العربي AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 mx-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium relative px-3 py-2 rounded-md transition-all duration-150 ease-in-out",
                  "hover:bg-accent/50 hover:text-primary transform hover:scale-105",
                  isActive 
                    ? "text-primary bg-accent/30" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full transition-all duration-150 ease-in-out" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-1">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-accent transition-all duration-150 ease-in-out"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">بحث</span>
          </Button>

          {/* Theme Toggle */}
          <div className="transition-all duration-150 ease-in-out">
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden h-8 w-8 hover:bg-accent transition-all duration-150 ease-in-out"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 py-4">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2 font-bold text-lg pb-4 border-b">
                  <Brain className="h-6 w-6 text-primary animate-pulse" />
                  العربي للذكاء الاصطناعي
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-3">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname.startsWith(item.href))
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out transform hover:scale-105",
                          isActive 
                            ? "bg-primary/10 text-primary shadow-md" 
                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="mt-auto pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المظهر</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
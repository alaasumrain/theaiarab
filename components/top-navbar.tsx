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
  Plus
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/app/providers"

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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-[#FAFAFA]/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAFAFA]/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
        >
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          <span className="hidden sm:inline">العربي للذكاء الاصطناعي</span>
          <span className="sm:hidden">العربي AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 mx-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">بحث</span>
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
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
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
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
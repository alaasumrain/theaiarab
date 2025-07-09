"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Route mappings for Arabic labels
const routeLabels: Record<string, string> = {
  "/": "الرئيسية",
  "/tools": "الأدوات",
  "/products": "الأدوات", 
  "/tutorials": "التعلم",
  "/news": "الأخبار",
  "/pricing": "الأسعار",
  "/submit": "أضف أداة",
  "/search": "نتائج البحث",
  "/admin": "لوحة التحكم",
  "/admin/products": "إدارة الأدوات",
  "/admin/news": "إدارة الأخبار",
  "/admin/media": "مكتبة الوسائط",
  "/admin/users": "إدارة المستخدمين",
  "/admin/settings": "الإعدادات",
  "/favorites": "المفضلة",
  "/login": "تسجيل الدخول"
}

export function SmartBreadcrumb() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on home page or login pages
  if (pathname === "/" || pathname.startsWith("/login")) {
    return null
  }

  // Split path and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbItems = []
  
  // Always start with home
  breadcrumbItems.push({
    href: "/",
    label: "الرئيسية",
    isLast: false
  })

  // Build path progressively
  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    let label = routeLabels[currentPath] || segment

    // Handle dynamic routes
    if (!routeLabels[currentPath]) {
      // For product/tutorial/news detail pages, use a generic label
      if (currentPath.includes("/products/") || currentPath.includes("/tools/")) {
        label = "تفاصيل الأداة"
      } else if (currentPath.includes("/tutorials/")) {
        label = "الدرس"
      } else if (currentPath.includes("/news/")) {
        label = "المقال"
      } else if (currentPath.includes("/admin/") && segment !== "admin") {
        // For admin sub-pages, try to get a meaningful label
        if (segment === "create") {
          label = "إنشاء جديد"
        } else if (segment === "edit") {
          label = "تحرير"
        } else if (segment.length > 10) {
          // Likely an ID, use generic label
          label = "التفاصيل"
        } else {
          label = segment
        }
      } else {
        // Capitalize first letter for other segments
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }
    }

    breadcrumbItems.push({
      href: currentPath,
      label,
      isLast
    })
  })

  return (
    <div className="container mx-auto px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="flex items-center gap-1">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
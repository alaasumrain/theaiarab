import { Suspense } from "react"
import Link from "next/link"
import { Brain, Sparkles, BookOpen, Newspaper, ArrowLeft, ArrowRight, Zap, Star } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/cult/fade-in"
import { DirectorySearch } from "@/components/directory-search"
import { Hero } from "@/components/hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  EmptyFeaturedGrid,
  FeaturedGrid,
  ResourceCardGrid,
} from "../components/directory-card-grid"
import { NavSidebar } from "../components/nav"
import { getCachedFilters } from "./actions/cached_actions"
import { getProducts } from "./actions/product"

// Featured AI tools to highlight
const FEATURED_IDS: string[] = [
  '550e8400-e29b-41d4-a716-446655440001', // ChatGPT
  '550e8400-e29b-41d4-a716-446655440004', // Midjourney
  '550e8400-e29b-41d4-a716-446655440002', // Claude
  '550e8400-e29b-41d4-a716-446655440014', // Perplexity
  '550e8400-e29b-41d4-a716-446655440007', // GitHub Copilot
  '550e8400-e29b-41d4-a716-446655440005', // DALL-E 3
]

async function Page({ searchParams }: { searchParams: { search?: string } }) {
  let data = await getProducts(searchParams.search)
  let filters = await getCachedFilters()
  const filteredFeaturedData = data.filter((d: any) =>
    FEATURED_IDS.includes(d.id)
  )
  
  // Get popular tools (high view count)
  const popularTools = data
    .sort((a: any, b: any) => b.view_count - a.view_count)
    .slice(0, 6)
  
  // Get latest tools
  const latestTools = data
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <div className="max-w-full px-2 md:pr-4 md:pl-0 pt-2 md:mr-[12rem]">
        <FadeIn>
          {/* Hero Section */}
          <div className="pb-8 pt-8">
            <Hero>
              <DirectorySearch />
            </Hero>
          </div>
          
          {/* Three Main Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:h-auto">
            {/* AI Tools Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
              <Link href="/tools">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Brain className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-2xl">أدوات الذكاء الاصطناعي</CardTitle>
                  <CardDescription className="text-base">
                    أكثر من 100 أداة ذكاء اصطناعي مع شروحات باللغة العربية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">شات جي بي تي</Badge>
                    <Badge variant="secondary">ميدجورني</Badge>
                    <Badge variant="secondary">كلود</Badge>
                    <Badge variant="outline">+97 أخرى</Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            {/* Learning Hub Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
              <Link href="/tutorials">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                  </div>
                  <CardTitle className="text-2xl">مركز التعلم</CardTitle>
                  <CardDescription className="text-base">
                    دروس ودورات تعليمية شاملة للمبتدئين والمحترفين في الذكاء الاصطناعي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span>دليل المبتدئين الشامل</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span>هندسة الأوامر المتقدمة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span>حالات استخدام عملية</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            {/* News Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
              <Link href="/news">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Newspaper className="h-8 w-8 text-purple-600" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                  <CardTitle className="text-2xl">آخر الأخبار</CardTitle>
                  <CardDescription className="text-base">
                    تابع آخر تطورات وأخبار الذكاء الاصطناعي من جميع أنحاء العالم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span>إطلاق GPT-5 قريباً</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span>تحديث جديد لـ Midjourney</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span>Claude 3 يدعم العربية</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
          
          <Separator className="my-8" />
          
          {/* Popular Tools Section */}
          <div id="featured" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold">الأدوات الأكثر شعبية</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/tools?sort=popular">
                  عرض الكل
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[2rem] p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]">
              {popularTools.length > 0 ? (
                <FeaturedGrid featuredData={popularTools} />
              ) : (
                <EmptyFeaturedGrid />
              )}
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* All Tools Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">جميع الأدوات</h2>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {data.length} أداة
              </Badge>
            </div>
            
            <ResourceCardGrid
              sortedData={data}
              filteredFeaturedData={filteredFeaturedData}
            />
          </div>
        </FadeIn>
      </div>
    </>
  )
}

export default Page
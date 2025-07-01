import { ReactElement } from "react"
import { Brain, Sparkles, ArrowLeft, Filter, Grid3X3, List } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { GradientHeading } from "@/components/cult/gradient-heading"
import { ResourceCardGrid } from "@/components/directory-card-grid"

import { NavSidebar } from "../../components/nav"
import { getCachedFilters } from "../actions/cached_actions"
import { getProducts } from "../actions/product"

export const dynamic = "force-dynamic"

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: {
    search?: string
    category?: string
    label?: string
    tag?: string
    sort?: string
  }
}): Promise<ReactElement> {
  const { search, category, label, tag, sort } = searchParams
  const data = await getProducts(search, category, label, tag)
  let filters = await getCachedFilters()

  // Sort data based on sort parameter
  let sortedData = [...data]
  switch (sort) {
    case 'popular':
      sortedData = sortedData.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      break
    case 'newest':
      sortedData = sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'name':
      sortedData = sortedData.sort((a, b) => (a.arabic_name || a.codename).localeCompare(b.arabic_name || b.codename, 'ar'))
      break
    default:
      // Default to popular
      sortedData = sortedData.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <div className="max-w-full pt-4">
        <FadeIn>
          {/* Page Header */}
          <div className="mb-8 px-4">
            {/* Back Navigation */}
            <div className="mb-6">
              <Button variant="ghost" asChild className="text-right">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة للرئيسية
                </Link>
              </Button>
            </div>

            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
                <GradientHeading size="xxl">أدوات الذكاء الاصطناعي</GradientHeading>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                استكشف مجموعة شاملة من أحدث أدوات الذكاء الاصطناعي مع شروحات باللغة العربية
              </p>
            </div>

            {/* Stats and Sort Bar */}
            <div className="flex items-center justify-between mb-6 bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {sortedData.length} أداة متاحة
                </Badge>
                {(search || category || label || tag) && (
                  <Badge variant="secondary">
                    نتائج مفلترة
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">ترتيب حسب:</span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant={sort === 'popular' || !sort ? "default" : "outline"} 
                    size="sm" 
                    asChild
                  >
                    <Link href="/tools?sort=popular">الأكثر شعبية</Link>
                  </Button>
                  <Button 
                    variant={sort === 'newest' ? "default" : "outline"} 
                    size="sm" 
                    asChild
                  >
                    <Link href="/tools?sort=newest">الأحدث</Link>
                  </Button>
                  <Button 
                    variant={sort === 'name' ? "default" : "outline"} 
                    size="sm" 
                    asChild
                  >
                    <Link href="/tools?sort=name">حسب الاسم</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Display */}
          <ResourceCardGrid sortedData={sortedData} filteredFeaturedData={null}>
            {search ?? category ?? label ?? tag ? (
              <div className="md:ml-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  {search ? (
                    <Filter className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {category ? (
                    <Grid3X3 className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {label ? (
                    <List className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {tag ? (
                    <Brain className="ml-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />
                  ) : null}
                  {search ? "البحث" : ""}
                  {category ? "الفئة" : ""}
                  {label ? "التصنيف" : ""}
                  {tag ? "العلامة" : ""}
                </div>
                <GradientHeading size="xl">
                  {search ?? category ?? label ?? tag}
                </GradientHeading>
                <div className="text-sm text-muted-foreground mt-2">
                  {sortedData.length} نتيجة
                </div>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/tools">
                    مسح الفلاتر
                  </Link>
                </Button>
              </div>
            ) : null}
          </ResourceCardGrid>
        </FadeIn>
      </div>
    </>
  )
}
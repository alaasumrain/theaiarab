import { ReactElement } from "react"
import { Brain, Sparkles, ArrowLeft, Filter, Grid3X3, List } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { GradientHeading } from "@/components/cult/gradient-heading"
import { PageLayout } from "@/components/cult/page-layout"
import { PageHeader } from "@/components/cult/page-header"
import { ResourceCardGrid } from "@/components/directory-card-grid"

import { NavSidebar } from "../../components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
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
  
  let data: any[] = []
  let filters: { categories: string[]; labels: string[]; tags: string[] } = { 
    categories: [], 
    labels: [], 
    tags: [] 
  }
  
  try {
    data = await getProducts(search, category, label, tag)
    filters = await getCachedFilters()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

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

  const totalTools = sortedData.length
  const freeTools = sortedData.filter(tool => tool.is_free).length
  const paidTools = totalTools - freeTools

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <AdaptiveLayout>
        <PageLayout maxWidth="full">
        <FadeIn>
          <PageHeader
            title="أدوات الذكاء الاصطناعي"
            description="استكشف مجموعة شاملة من أحدث أدوات الذكاء الاصطناعي مع شروحات باللغة العربية"
            icon={Brain}
            iconColor="text-primary animate-pulse"
            backHref="/"
            stats={[
              { label: "أدوات متاحة", value: totalTools },
              { label: "أدوات مجانية", value: freeTools },
              { label: "أدوات مدفوعة", value: paidTools }
            ]}
          >
            {/* Filter Information */}
            {(search || category || label || tag) && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 mb-4">
                  {search && <Filter className="h-4 w-4 text-yellow-500" />}
                  {category && <Grid3X3 className="h-4 w-4 text-blue-500" />}
                  {label && <List className="h-4 w-4 text-green-500" />}
                  {tag && <Brain className="h-4 w-4 text-purple-500" />}
                  <span className="text-sm font-medium">
                    {search ? "البحث: " : ""}
                    {category ? "الفئة: " : ""}
                    {label ? "التصنيف: " : ""}
                    {tag ? "العلامة: " : ""}
                    <span className="text-primary">{search || category || label || tag}</span>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {sortedData.length} نتيجة
                </div>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/tools">
                    مسح الفلاتر
                  </Link>
                </Button>
              </div>
            )}

            {/* Sort Bar */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">ترتيب حسب:</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant={sort === 'popular' || !sort ? "default" : "outline"} 
                  size="sm" 
                  asChild
                  className="transition-all duration-300"
                >
                  <Link href="/tools?sort=popular">الأكثر شعبية</Link>
                </Button>
                <Button 
                  variant={sort === 'newest' ? "default" : "outline"} 
                  size="sm" 
                  asChild
                  className="transition-all duration-300"
                >
                  <Link href="/tools?sort=newest">الأحدث</Link>
                </Button>
                <Button 
                  variant={sort === 'name' ? "default" : "outline"} 
                  size="sm" 
                  asChild
                  className="transition-all duration-300"
                >
                  <Link href="/tools?sort=name">حسب الاسم</Link>
                </Button>
              </div>
            </div>
          </PageHeader>

          {/* Tools Grid */}
          <ResourceCardGrid sortedData={sortedData} filteredFeaturedData={null} />
        </FadeIn>
        </PageLayout>
      </AdaptiveLayout>
    </>
  )
}
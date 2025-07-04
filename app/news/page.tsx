import { Newspaper, Clock, ExternalLink, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/cult/page-header"
import { PageGrid } from "@/components/cult/page-grid"
import { getNews, getFeaturedNews, getNewsFilters } from "../actions/news"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { FadeIn } from "@/components/cult/fade-in"

export const dynamic = "force-dynamic"

export default async function NewsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
  }
}) {
  const { category } = searchParams
  const [news, featuredNews, filters] = await Promise.all([
    getNews(category),
    getFeaturedNews(2),
    getNewsFilters()
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string | null | undefined) => {
    if (!content) return '1 دقيقة'
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} دقائق`
  }

  const getContent = (article: any) => {
    return article.content_ar || article.content || ''
  }

  const getSummary = (article: any) => {
    return article.summary_ar || article.summary || getContent(article).substring(0, 150) + '...'
  }

  const totalNews = news.length
  const featuredCount = featuredNews.length
  const regularCount = news.filter(article => !article.is_featured).length

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={[]}
        tags={[]}
      />
      
      <AdaptiveLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <FadeIn>
            <PageHeader
              title="آخر أخبار الذكاء الاصطناعي"
        description="تابع آخر التطورات والإطلاقات في عالم الذكاء الاصطناعي"
        icon={Newspaper}
        backHref="/"
        stats={[
          { label: "مقالات متاحة", value: totalNews },
          { label: "أخبار مميزة", value: featuredCount },
          { label: "تحديث يومي", value: "🔥" }
        ]}
      />

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">الأخبار المميزة</h2>
            <Badge variant="default" className="animate-pulse">جديد</Badge>
          </div>
          
          <PageGrid columns="2" className="mb-8">
            {featuredNews.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="default" className="transition-all duration-300 hover:scale-105">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getReadingTime(getContent(article))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.view_count}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl leading-relaxed group-hover:text-primary transition-colors duration-300">
                    {article.title_ar}
                  </CardTitle>
                  
                  <CardDescription className="text-base leading-relaxed">
                    {getSummary(article)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span>{formatDate(article.published_at)}</span>
                      {article.author && <span> • {article.author}</span>}
                    </div>
                    <Button variant="outline" size="sm" asChild className="transition-all duration-300 hover:scale-105">
                      <Link href={`/news/${article.id}`}>
                        اقرأ المقال
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </PageGrid>
        </div>
      )}

      {/* All News */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">جميع الأخبار</h2>
          <Badge variant="outline">{regularCount} مقال</Badge>
        </div>
        
        <PageGrid columns="2">
          {news.filter(article => !article.is_featured).map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={
                    article.category === 'تحديثات' ? 'default' :
                    article.category === 'تعليم' ? 'secondary' : 'outline'
                  } className="transition-all duration-300 hover:scale-105">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getReadingTime(getContent(article))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.view_count}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl leading-relaxed group-hover:text-primary transition-colors duration-300">
                  {article.title_ar}
                </CardTitle>
                
                <CardDescription className="text-base leading-relaxed line-clamp-2">
                  {getSummary(article)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span>{formatDate(article.published_at)}</span>
                    {article.author && <span> • {article.author}</span>}
                  </div>
                  <Button variant="outline" size="sm" asChild className="transition-all duration-300 hover:scale-105">
                    <Link href={`/news/${article.id}`}>
                      اقرأ المقال
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </PageGrid>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>لا تفوت أي تحديث!</CardTitle>
            <CardDescription>
              نقوم بتجميع أهم أخبار الذكاء الاصطناعي وترجمتها للعربية أسبوعياً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="transition-all duration-300 hover:scale-105">
              <Link href="/submit">
                شاركنا خبراً مهماً
              </Link>
            </Button>
          </CardContent>
            </Card>
          </div>
          </FadeIn>
        </div>
      </AdaptiveLayout>
    </>
  )
}
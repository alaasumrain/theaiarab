import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, Share2, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getNewsById, incrementNewsViews, getLatestNews } from "../../actions/news"
import { ContentImage } from "@/components/content-image"

export const dynamic = "force-dynamic"

interface NewsPageProps {
  params: {
    id: string
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const article = await getNewsById(params.id)
  
  if (!article) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementNewsViews(article.id).catch(console.error)

  // Get latest news for sidebar
  const latestNews = await getLatestNews(4)
  
  const getReadingTime = (content: string | null | undefined) => {
    if (!content) return '1 دقيقة'
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} دقائق`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContent = (article: any) => {
    return article.content_ar || article.content || ''
  }

  const articleContent = getContent(article)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-right">
            <Link href="/news" className="flex items-center gap-2 hover:bg-accent transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              العودة للأخبار
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0"> {/* min-w-0 prevents overflow */}
            <article className="space-y-8">
              {/* Header */}
              <header>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="default" className="transition-all duration-300 hover:scale-105">
                    {article.category}
                  </Badge>
                  {article.is_featured && (
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                      مميز
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold leading-tight mb-4 text-foreground">
                  {article.title_ar}
                </h1>
                
                {article.title_en && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {article.title_en}
                  </p>
                )}

                {/* Article Image */}
                <div className="mb-6">
                  <ContentImage 
                    image_url={article.image_url}
                    content_type="news"
                    title={article.title_ar}
                    aspectRatio="wide"
                    className="h-64 md:h-80 transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Summary */}
                {(article.summary_ar || article.summary) && (
                  <div className="bg-muted/50 p-6 rounded-lg mb-6 border border-muted transition-all duration-300 hover:border-primary/20">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {article.summary_ar || article.summary}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(articleContent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{(article.view_count || 0) + 1} مشاهدة</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                  )}
                </div>
              </header>

              <Separator />

              {/* Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-right prose-p:text-right prose-li:text-right prose-blockquote:text-right">
                <div 
                  className="article-content space-y-4 text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: articleContent
                      .replace(/^# /gm, '<h1 class="text-3xl font-bold mb-4 mt-8 text-foreground">')
                      .replace(/^## /gm, '<h2 class="text-2xl font-semibold mb-3 mt-6 text-foreground">')
                      .replace(/^### /gm, '<h3 class="text-xl font-medium mb-2 mt-4 text-foreground">')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                      .replace(/```(.*?)```/gs, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto border"><code>$1</code></pre>')
                      .replace(/`(.*?)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
                      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
                      .replace(/^/gm, '<p class="mb-4 leading-relaxed">')
                      .replace(/<p class="mb-4 leading-relaxed">(<h[1-6])/g, '$1')
                      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline transition-colors duration-300">$1</a>')
                  }}
                />
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">شارك هذا المقال</h3>
                        <p className="text-muted-foreground">ساعد الآخرين في البقاء على اطلاع</p>
                      </div>
                      <Button variant="outline" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
                        <Share2 className="h-4 w-4" />
                        شارك
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 pb-8">
              {/* Latest News */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    آخر الأخبار
                  </CardTitle>
                  <CardDescription>
                    مقالات أخرى قد تهمك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {latestNews
                    .filter(news => news.id !== article.id)
                    .slice(0, 3)
                    .map((newsItem) => (
                    <Link 
                      key={newsItem.id} 
                      href={`/news/${newsItem.id}`}
                      className="block group"
                    >
                      <div className="space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-accent">
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {newsItem.title_ar}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {newsItem.category}
                          </Badge>
                          <span>•</span>
                          <span>{newsItem.view_count || 0} مشاهدة</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>التصنيفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['تحديثات', 'تعليم', 'أدوات', 'أبحاث', 'تحليل'].map((category) => (
                      <Link 
                        key={category}
                        href={`/news?category=${encodeURIComponent(category)}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-md hover:bg-accent"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-primary/5 border-primary/20 transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">هل استفدت من هذا المقال؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    شاركنا مقالاً أو خبراً مهماً في عالم الذكاء الاصطناعي
                  </p>
                  <Button className="w-full transition-all duration-300 hover:scale-105" asChild>
                    <Link href="/submit">
                      اقترح خبر جديد
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
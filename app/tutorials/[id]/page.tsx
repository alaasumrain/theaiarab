import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Eye, Share2, BookOpen, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getTutorialBySlug, incrementTutorialViews, getFeaturedTutorials } from "../../actions/tutorials"

export const dynamic = "force-dynamic"

interface TutorialPageProps {
  params: {
    id: string
  }
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = await getTutorialBySlug(params.id)
  
  if (!tutorial) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementTutorialViews(tutorial.id).catch(console.error)

  // Get featured tutorials for sidebar
  const featuredTutorials = await getFeaturedTutorials()
  
  const getDurationFromContent = (content: string | null | undefined) => {
    if (!content) return '1 دقيقة'
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} دقيقة`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContent = (tutorial: any) => {
    return tutorial.content_ar || tutorial.content || ''
  }

  const tutorialContent = getContent(tutorial)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-right">
            <Link href="/tutorials" className="flex items-center gap-2 hover:bg-accent transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              العودة للدروس
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            <article className="space-y-8">
              {/* Header */}
              <header>
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant={
                      tutorial.difficulty === 'مبتدئ' ? 'default' : 
                      tutorial.difficulty === 'متوسط' ? 'secondary' : 'destructive'
                    }
                    className="transition-all duration-300 hover:scale-105"
                  >
                    {tutorial.difficulty || 'مبتدئ'}
                  </Badge>
                  <Badge variant="outline" className="transition-all duration-300 hover:scale-105">
                    {tutorial.category}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight mb-4 text-foreground">
                  {tutorial.title_ar}
                </h1>
                
                {tutorial.title_en && (
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    {tutorial.title_en}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getDurationFromContent(tutorialContent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{(tutorial.view_count || 0) + 1} مشاهدة</span>
                  </div>
                  {tutorial.created_at && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>نُشر في {formatDate(tutorial.created_at)}</span>
                    </div>
                  )}
                </div>
              </header>

              <Separator />

              {/* Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-right prose-p:text-right prose-li:text-right prose-blockquote:text-right">
                <div 
                  className="tutorial-content space-y-4 text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: tutorialContent
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
                        <h3 className="text-lg font-semibold mb-2">شارك هذا الدرس</h3>
                        <p className="text-muted-foreground">ساعد الآخرين في التعلم</p>
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
              {/* Featured Tutorials */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    دروس مميزة
                  </CardTitle>
                  <CardDescription>
                    دروس أخرى قد تهمك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredTutorials
                    .filter(t => t.id !== tutorial.id)
                    .slice(0, 3)
                    .map((featuredTutorial) => (
                    <Link 
                      key={featuredTutorial.id} 
                      href={`/tutorials/${featuredTutorial.id}`}
                      className="block group"
                    >
                      <div className="space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-accent">
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {featuredTutorial.title_ar}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {featuredTutorial.difficulty || 'مبتدئ'}
                          </Badge>
                          <span>•</span>
                          <span>{featuredTutorial.view_count || 0} مشاهدة</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>مسار التعلم المقترح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>أساسيات الذكاء الاصطناعي</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ChatGPT للمبتدئين</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>هندسة الطلبات المتقدمة</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-all duration-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>أدوات التصميم بالذكاء الاصطناعي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-primary/5 border-primary/20 transition-all duration-300 hover:shadow-md hover:border-primary/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">هل استفدت من هذا الدرس؟</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    شاركنا اقتراحاً لدرس جديد أو أداة ذكية
                  </p>
                  <Button className="w-full transition-all duration-300 hover:scale-105" asChild>
                    <Link href="/submit">
                      اقترح محتوى جديد
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
import { Brain, BookOpen, ArrowLeft, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/cult/page-header"
import { PageGrid } from "@/components/cult/page-grid"
import { getTutorials, getTutorialFilters } from "../actions/tutorials"
import { NavSidebar } from "@/components/nav"
import { AdaptiveLayout } from "@/components/adaptive-layout"
import { FadeIn } from "@/components/cult/fade-in"

export const dynamic = "force-dynamic"

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    difficulty?: string
  }
}) {
  const { category, difficulty } = searchParams
  const [tutorials, filters] = await Promise.all([
    getTutorials(category, difficulty),
    getTutorialFilters()
  ])

  const getDurationFromContent = (content: string) => {
    // Estimate reading time based on content length (roughly 200 words per minute)
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} دقيقة`
  }

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.difficulties}
        tags={[]}
      />
      
      <AdaptiveLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <FadeIn>
            <PageHeader
              title="مركز التعلم"
              description="دروس تعليمية شاملة لتعلم استخدام أدوات الذكاء الاصطناعي بالعربية"
              icon={BookOpen}
              backHref="/"
              stats={[
                { label: "دروس متاحة", value: tutorials.length },
                { label: "مستويات مختلفة", value: "3" },
                { label: "باللغة العربية", value: "100%" }
              ]}
            />

            <PageGrid columns="3" className="mb-12">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Brain className="h-8 w-8 text-primary mb-3 transition-transform duration-300 group-hover:scale-110" />
                <Badge 
                  variant={
                    tutorial.difficulty === 'مبتدئ' ? 'default' : 
                    tutorial.difficulty === 'متوسط' ? 'secondary' : 'destructive'
                  }
                  className="transition-all duration-300 hover:scale-105"
                >
                  {tutorial.difficulty || 'مبتدئ'}
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed group-hover:text-primary transition-colors duration-300">
                {tutorial.title_ar}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed line-clamp-3">
                {tutorial.content.substring(0, 150)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{getDurationFromContent(tutorial.content)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{tutorial.view_count || 0}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tutorial.category}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild className="transition-all duration-300 hover:scale-105">
                  <Link href={`/tutorials/${tutorial.id}`}>
                    ابدأ التعلم
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </PageGrid>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>المزيد قريباً!</CardTitle>
            <CardDescription>
              نعمل على إضافة المزيد من الدروس التعليمية المتقدمة. 
              اشترك ليصلك كل جديد.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="transition-all duration-300 hover:scale-105">
              <Link href="/submit">
                شارك اقتراحاتك للدروس
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
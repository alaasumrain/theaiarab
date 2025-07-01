import { Brain, BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TutorialsPage() {
  const tutorials = [
    {
      id: 1,
      title: "دليل المبتدئين لاستخدام ChatGPT بالعربية",
      description: "تعلم كيفية استخدام ChatGPT بفعالية للكتابة والبحث والإبداع",
      difficulty: "مبتدئ",
      duration: "15 دقيقة",
      category: "أساسيات"
    },
    {
      id: 2, 
      title: "تصميم الصور بالذكاء الاصطناعي - دليل Midjourney",
      description: "اكتشف كيفية إنشاء صور مذهلة باستخدام Midjourney وهندسة الأوامر",
      difficulty: "متوسط",
      duration: "25 دقيقة", 
      category: "إبداعي"
    },
    {
      id: 3,
      title: "هندسة الأوامر المتقدمة - إطلاق قوة الذكاء الاصطناعي",
      description: "تقنيات متقدمة لكتابة أوامر فعالة والحصول على نتائج مثالية",
      difficulty: "متقدم",
      duration: "35 دقيقة",
      category: "متقدم" 
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-right">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
      
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">مركز التعلم</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          دروس تعليمية شاملة لتعلم استخدام أدوات الذكاء الاصطناعي بالعربية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Brain className="h-8 w-8 text-primary mb-3" />
                <Badge variant={
                  tutorial.difficulty === 'مبتدئ' ? 'default' : 
                  tutorial.difficulty === 'متوسط' ? 'secondary' : 'destructive'
                }>
                  {tutorial.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {tutorial.title}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {tutorial.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>{tutorial.duration}</span> • <span>{tutorial.category}</span>
                </div>
                <Button variant="outline" size="sm">
                  ابدأ التعلم
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>المزيد قريباً!</CardTitle>
            <CardDescription>
              نعمل على إضافة المزيد من الدروس التعليمية المتقدمة. 
              اشترك ليصلك كل جديد.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/submit">
                شارك اقتراحاتك للدروس
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
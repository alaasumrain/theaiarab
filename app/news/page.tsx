import { Newspaper, Clock, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: "إطلاق GPT-5 المنتظر من OpenAI قريباً",
      summary: "تسريبات تشير إلى إطلاق الجيل الخامس من ChatGPT بقدرات محسنة للفهم والإبداع",
      category: "إطلاقات",
      date: "2025-01-01",
      readTime: "3 دقائق",
      url: "https://openai.com"
    },
    {
      id: 2,
      title: "Midjourney V6 يدعم النصوص العربية بشكل أفضل", 
      summary: "التحديث الجديد يحسن من قدرة الذكاء الاصطناعي على فهم الأوامر العربية وإنتاج نصوص عربية في الصور",
      category: "تحديثات",
      date: "2024-12-28",
      readTime: "5 دقائق",
      url: "https://midjourney.com"
    },
    {
      id: 3,
      title: "Claude 3.5 يحقق اختراقاً في فهم السياق العربي",
      summary: "دراسة جديدة تظهر تفوق Claude في معالجة النصوص العربية وفهم الثقافة المحلية",
      category: "أبحاث", 
      date: "2024-12-25",
      readTime: "7 دقائق",
      url: "https://anthropic.com"
    },
    {
      id: 4,
      title: "Google تطلق Gemini Pro مع دعم محسن للعربية",
      summary: "إعلان رسمي عن تحسينات كبيرة في دعم اللغة العربية ضمن نموذج Gemini الجديد",
      category: "إطلاقات",
      date: "2024-12-20", 
      readTime: "4 دقائق",
      url: "https://gemini.google.com"
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
          <Newspaper className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">آخر أخبار الذكاء الاصطناعي</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          تابع آخر التطورات والإطلاقات في عالم الذكاء الاصطناعي
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {news.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <Badge variant={
                  article.category === 'إطلاقات' ? 'default' :
                  article.category === 'تحديثات' ? 'secondary' : 'outline'
                }>
                  {article.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 ml-1" />
                  {article.readTime}
                </div>
              </div>
              
              <CardTitle className="text-xl leading-relaxed group-hover:text-primary transition-colors">
                {article.title}
              </CardTitle>
              
              <CardDescription className="text-base leading-relaxed">
                {article.summary}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(article.date).toLocaleDateString('ar-SA')}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={article.url} target="_blank" rel="noopener noreferrer">
                    اقرأ المزيد
                    <ExternalLink className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>لا تفوت أي تحديث!</CardTitle>
            <CardDescription>
              نقوم بتجميع أهم أخبار الذكاء الاصطناعي وترجمتها للعربية أسبوعياً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/submit">
                شاركنا خبراً مهماً
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
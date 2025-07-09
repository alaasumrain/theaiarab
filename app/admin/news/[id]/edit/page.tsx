import { notFound } from "next/navigation"
import { createClient } from "@/db/supabase/server"
import { NewsForm } from "../../news-form"

async function getNewsArticle(id: string) {
  const supabase = createClient()
  
  const { data: article, error } = await supabase
    .from('ai_news')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !article) {
    return null
  }

  return article
}

export default async function EditNewsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const article = await getNewsArticle(params.id)

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">تحرير المقال</h1>
        <p className="text-muted-foreground">
          تحرير مقال: {article.title_ar}
        </p>
      </div>

      <NewsForm article={article} isEdit />
    </div>
  )
}
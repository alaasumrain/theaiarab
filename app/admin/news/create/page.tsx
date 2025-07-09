import { NewsForm } from "../news-form"

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إنشاء مقال جديد</h1>
        <p className="text-muted-foreground">
          أضف مقال أخبار أو محتوى تعليمي جديد
        </p>
      </div>

      <NewsForm />
    </div>
  )
}
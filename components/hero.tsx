import React from "react"
import Link from "next/link"
import { Brain, Sparkles, Zap, BookOpen, Newspaper } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center md:items-start md:px-2 justify-center gap-2 md:ml-12">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <Brain className="h-10 w-10 text-primary animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-black text-right mr-3">
            العربي للذكاء الاصطناعي
          </h1>
        </div>
      </div>
      
      <div className="flex flex-col items-center md:items-start md:mt-4 gap-3">
        <Badge className="text-base px-4 py-1" variant="default">
          <Sparkles className="h-4 w-4 ml-2" />
          مركزك الشامل لأدوات الذكاء الاصطناعي
        </Badge>
        
        <p className="mt-2 text-center md:text-right text-foreground text-lg md:text-xl px-2 font-medium">
          اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات بالعربية
        </p>
        
        <p className="text-center md:text-right text-muted-foreground text-sm md:text-base px-2 max-w-xl">
          دليلك الشامل لـ ChatGPT، Midjourney، Claude وأكثر من 100 أداة ذكاء اصطناعي
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6 mb-4 justify-center md:justify-start">
        <Button variant="default" size="lg" asChild className="group">
          <Link href="/submit" className="flex items-center gap-2">
            <Zap className="h-5 w-5 group-hover:animate-pulse" />
            أضف أداة جديدة
          </Link>
        </Button>
        
        <Button variant="secondary" size="lg" asChild>
          <Link href="/tutorials" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            دروس تعليمية
          </Link>
        </Button>
        
        <Button variant="outline" size="lg" asChild>
          <Link href="/news" className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            آخر الأخبار
          </Link>
        </Button>
      </div>
      
      <div className="flex gap-6 text-sm text-muted-foreground mt-2 justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>+100 أداة</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span>+50 درس</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span>محدث يومياً</span>
        </div>
      </div>
      
      {children}
    </div>
  )
}
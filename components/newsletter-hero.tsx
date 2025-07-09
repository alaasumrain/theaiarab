"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Brain, Mail, Sparkles, BookOpen, Newspaper, Zap, CheckCircle, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

interface NewsletterHeroProps {
  children?: React.ReactNode
}

export function NewsletterHero({ children }: NewsletterHeroProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await subscribeToNewsletter(email)
      
      if (result.success) {
        setIsSuccess(true)
        setEmail("")
      } else {
        setError(result.error || "حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.")
      }
    } catch (err) {
      setError("حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto text-center">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-12 w-12 text-primary animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-black">
          العربي للذكاء الاصطناعي
        </h1>
      </div>
      
      {/* Main Headline */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          اكتشف أفضل أدوات الذكاء الاصطناعي
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          دليل شامل لأكثر من 100 أداة ذكاء اصطناعي مع شروحات باللغة العربية
        </p>
      </div>

      {/* Newsletter Signup */}
      <div className="w-full max-w-md space-y-4">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 text-lg text-right"
                dir="rtl"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 ml-2" />
                    اشترك مجاناً
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <p className="text-green-700 dark:text-green-300 font-medium">
              تم تسجيلك بنجاح! ترقب رسائلنا قريباً.
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          بريدك الإلكتروني آمن معنا. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>

      {/* Statistics */}
      <div className="text-sm text-muted-foreground">
        أكثر من 100 أداة ذكاء اصطناعي
      </div>
      
      {children}
    </div>
  )
}
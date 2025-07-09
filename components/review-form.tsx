"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, Loader2, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { createClient } from "@/db/supabase/client"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
  onSubmit?: (review: {
    rating: number
    comment: string
    userId: string
  }) => Promise<{ success: boolean; error?: string }>
}

export function ReviewForm({ productId, onReviewSubmitted, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError("يجب تسجيل الدخول أولاً")
      return
    }

    if (rating === 0) {
      setError("يرجى اختيار تقييم")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      if (onSubmit) {
        const result = await onSubmit({
          rating,
          comment: comment.trim(),
          userId: user.id
        })

        if (result.success) {
          setIsSuccess(true)
          setRating(0)
          setComment("")
          
          if (onReviewSubmitted) {
            onReviewSubmitted()
          }
        } else {
          setError(result.error || "حدث خطأ في إرسال التقييم")
        }
      }
    } catch (err) {
      setError("حدث خطأ في إرسال التقييم. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <MessageSquare className="h-5 w-5" />
            سجل دخولك لكتابة تقييم
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            يجب أن تكون مسجلاً لتتمكن من كتابة تقييم وتساعد المجتمع في اختيار الأدوات المناسبة
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href="/login">
                <UserPlus className="h-4 w-4" />
                إنشاء حساب جديد
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            التسجيل مجاني ويستغرق أقل من دقيقة
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-green-600 dark:text-green-400 text-lg font-medium">
              شكراً لك على تقييمك!
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm">
              تم إرسال تقييمك بنجاح وسيظهر قريباً
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSuccess(false)}
              className="mt-4"
            >
              إضافة تقييم آخر
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          إضافة تقييم
        </CardTitle>
        <CardDescription>
          مرحباً {user.user_metadata?.full_name || user.email} - شارك تجربتك مع هذه الأداة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">التقييم *</label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              التعليق (اختياري)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شارك تجربتك مع هذه الأداة..."
              rows={4}
              dir="rtl"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 ml-2" />
                إرسال التقييم
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
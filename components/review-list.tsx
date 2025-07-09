"use client"

import { MessageSquare, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"

export interface Review {
  id: string
  user_name: string
  user_email: string
  rating: number
  comment: string | null
  comment_ar: string | null
  helpful_count: number
  created_at: string
  updated_at: string
}

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  loading?: boolean
}

export function ReviewList({ reviews, averageRating, totalReviews, loading }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-medium">لا توجد تقييمات بعد</h3>
              <p className="text-muted-foreground">
                كن أول من يقيم هذه الأداة ويشارك تجربته
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const distribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            التقييمات ({totalReviews})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={averageRating} readonly size="lg" />
                  <p className="text-sm text-muted-foreground">
                    من {totalReviews} تقييم
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">توزيع التقييمات</h4>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-2">{stars}</span>
                  <StarRating rating={stars} readonly size="sm" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${totalReviews > 0 ? (distribution[stars as keyof typeof distribution] / totalReviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground w-6 text-left">
                    {distribution[stars as keyof typeof distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{review.user_name}</h4>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="outline">
                    {review.rating} نجمة
                  </Badge>
                </div>

                {/* Review Comment */}
                {(review.comment_ar || review.comment) && (
                  <div className="text-foreground leading-relaxed">
                    {review.comment_ar || review.comment}
                  </div>
                )}

                {/* Helpful Counter (future feature) */}
                {review.helpful_count > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {review.helpful_count} أشخاص وجدوا هذا التقييم مفيداً
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
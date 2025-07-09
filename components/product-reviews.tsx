"use client"

import { useState, useEffect } from "react"
import { ReviewForm } from "@/components/review-form"
import { ReviewList, Review } from "@/components/review-list"
import { submitReview, getProductReviews, getProductRating, ProductRating } from "@/app/actions/reviews"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<ProductRating>({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId)
      ])
      
      setReviews(reviewsData)
      setRating(ratingData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [productId])

  const handleReviewSubmit = async (reviewData: {
    rating: number
    comment: string
    userId: string
  }) => {
    const result = await submitReview(productId, reviewData)
    
    if (result.success) {
      // Reload reviews to show the new one
      await loadReviews()
    }
    
    return result
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <ReviewForm 
        productId={productId}
        onSubmit={handleReviewSubmit}
        onReviewSubmitted={loadReviews}
      />

      {/* Reviews List */}
      <ReviewList 
        reviews={reviews}
        averageRating={rating.averageRating}
        totalReviews={rating.totalReviews}
        loading={loading}
      />
    </div>
  )
}
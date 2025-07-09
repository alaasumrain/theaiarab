"use client"

import { useEffect, useState } from "react"
import { AIToolCard } from "./ai-tool-card"
import { getProductRating } from "@/app/actions/reviews"

interface Product {
  id: string
  created_at: string
  full_name: string
  email: string
  twitter_handle: string
  product_website: string
  codename: string
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
  categories: string
  tool_type?: string
  difficulty_level?: string
  language_support?: string[]
  is_free?: boolean
  arabic_name?: string
  arabic_description?: string
  pricing_model?: string
}

interface AIToolCardWithRatingProps {
  trim?: boolean
  data: Product
  order: any
  context?: string
}

export const AIToolCardWithRating: React.FC<AIToolCardWithRatingProps> = ({ 
  trim, 
  data, 
  order, 
  context = "products" 
}) => {
  const [averageRating, setAverageRating] = useState<number>(0)
  const [reviewCount, setReviewCount] = useState<number>(0)

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const rating = await getProductRating(data.id)
        setAverageRating(rating.averageRating)
        setReviewCount(rating.totalReviews)
      } catch (error) {
        console.error('Error fetching rating:', error)
        // Gracefully handle errors by keeping default values
        setAverageRating(0)
        setReviewCount(0)
      }
    }

    // Only fetch if we're on the client side
    if (typeof window !== 'undefined') {
      fetchRating()
    }
  }, [data.id])

  const dataWithRating = {
    ...data,
    averageRating,
    reviewCount
  }

  return (
    <AIToolCard
      trim={trim}
      data={dataWithRating}
      order={order}
      context={context}
    />
  )
}
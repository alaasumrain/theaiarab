"use server"

import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"

export interface SubmitReviewResult {
  success: boolean
  error?: string
  message?: string
}

export interface ProductRating {
  averageRating: number
  totalReviews: number
}

export interface ReviewData {
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

export async function submitReview(
  productId: string,
  reviewData: {
    rating: number
    comment: string
    userId: string
  }
): Promise<SubmitReviewResult> {
  try {
    const { rating, comment, userId } = reviewData

    // Validate input
    if (!productId || !rating || !userId) {
      return {
        success: false,
        error: "جميع البيانات المطلوبة يجب أن تكون مُعبأة"
      }
    }

    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: "التقييم يجب أن يكون بين 1 و 5 نجوم"
      }
    }

    const supabase = createClient()

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return {
        success: false,
        error: "يجب تسجيل الدخول لكتابة تقييم"
      }
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return {
        success: false,
        error: "المنتج غير موجود"
      }
    }

    // Check if user already reviewed this product (now using user_id instead of email)
    const { data: existingReview, error: checkError } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing review:', checkError)
      return {
        success: false,
        error: "حدث خطأ في التحقق من التقييم السابق"
      }
    }

    if (existingReview) {
      return {
        success: false,
        error: "لقد قمت بتقييم هذا المنتج مسبقاً"
      }
    }

    // Get user profile data for the review
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم'
    const userEmail = user.email || ''

    // Insert new review with user authentication
    const { error: insertError } = await supabase
      .from('product_reviews')
      .insert({
        product_id: productId,
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        rating: rating,
        comment: comment.trim() || null,
        comment_ar: comment.trim() || null, // For now, assume Arabic comments
        helpful_count: 0
      })

    if (insertError) {
      console.error('Error inserting review:', insertError)
      return {
        success: false,
        error: "حدث خطأ في حفظ التقييم. يرجى المحاولة مرة أخرى."
      }
    }

    // Revalidate the product page to show new review
    revalidatePath(`/products/${productId}`)
    revalidatePath('/') // Also revalidate home page if it shows ratings

    return {
      success: true,
      message: "تم إرسال تقييمك بنجاح!"
    }

  } catch (error) {
    console.error('Review submission error:', error)
    return {
      success: false,
      error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    }
  }
}

export async function getProductReviews(productId: string): Promise<ReviewData[]> {
  try {
    const supabase = createClient()

    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return reviews || []
  } catch (error) {
    console.error('Get product reviews error:', error)
    return []
  }
}

export async function getProductRating(productId: string): Promise<ProductRating> {
  try {
    const supabase = createClient()

    // Try using the database functions first, fallback to direct queries if functions don't exist
    try {
      const { data: avgData, error: avgError } = await supabase
        .rpc('get_product_average_rating', { product_uuid: productId })

      const { data: countData, error: countError } = await supabase
        .rpc('get_product_review_count', { product_uuid: productId })

      if (!avgError && !countError) {
        return {
          averageRating: Number(avgData) || 0,
          totalReviews: Number(countData) || 0
        }
      }
    } catch (rpcError) {
      console.log('RPC functions not available, using direct queries')
    }

    // Fallback to direct queries if RPC functions fail
    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId)

    if (error) {
      console.error('Error getting product rating:', error)
      return { averageRating: 0, totalReviews: 0 }
    }

    if (!reviews || reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 }
    }

    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews
    }
  } catch (error) {
    console.error('Get product rating error:', error)
    return { averageRating: 0, totalReviews: 0 }
  }
}

export async function getProductsWithRatings(productIds: string[]) {
  try {
    const supabase = createClient()

    const ratings = await Promise.all(
      productIds.map(async (id) => {
        const rating = await getProductRating(id)
        return { productId: id, ...rating }
      })
    )

    return ratings
  } catch (error) {
    console.error('Get products with ratings error:', error)
    return []
  }
}
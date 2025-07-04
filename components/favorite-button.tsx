"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/db/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  productId: string
  initialIsFavorited?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
}

export function FavoriteButton({ 
  productId, 
  initialIsFavorited = false, 
  size = "default",
  variant = "ghost",
  className 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    
    // Optimistic update
    const previousState = isFavorited
    setIsFavorited(!isFavorited)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (previousState) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) throw error
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            product_id: productId
          })

        if (error) throw error
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Revert optimistic update on error
      setIsFavorited(previousState)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isFavorited && "text-red-500 hover:text-red-600",
        className
      )}
      title={isFavorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isFavorited && "fill-current"
        )} 
      />
      <span className="sr-only">
        {isFavorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      </span>
    </Button>
  )
} 
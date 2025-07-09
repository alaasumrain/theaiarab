"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  reviewCount?: number
  className?: string
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showCount = false,
  reviewCount,
  className
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  const handleStarClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleStarHover = (starValue: number) => {
    if (!readonly) {
      setHoveredRating(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating
          const isHalfFilled = star - 0.5 <= displayRating && star > displayRating

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              disabled={readonly}
              className={cn(
                "transition-colors duration-200",
                !readonly && "hover:scale-105 cursor-pointer",
                readonly && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-200",
                  isFilled || isHalfFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            </button>
          )
        })}
      </div>

      {showCount && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {rating > 0 ? rating.toFixed(1) : "0.0"}
          {reviewCount !== undefined && (
            <span className="mr-1">
              ({reviewCount} {reviewCount === 1 ? "تقييم" : "تقييم"})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
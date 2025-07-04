"use client"

import { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"
import { Video } from "lucide-react"
import placeholderImg from "@/assets/placeholder.png"

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fallback?: string
  src: string
}

// Helper function to determine if a URL is a video file
const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.m4v']
  const urlLower = url.toLowerCase()
  return videoExtensions.some(ext => urlLower.includes(ext))
}

// Helper function to determine if a URL is an image file
const isImageFile = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico']
  const urlLower = url.toLowerCase()
  return imageExtensions.some(ext => urlLower.includes(ext))
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = placeholderImg,
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    setError(false)
  }, [src])

  // If it's a video file, render a video element or video thumbnail
  if (isVideoFile(src)) {
    return (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative">
        <Video className="h-8 w-8 text-muted-foreground" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-muted-foreground bg-black/50 rounded px-2 py-1">
            Video
          </div>
        </div>
      </div>
    )
  }

  // For image files or unknown types, use the Image component with fallback
  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallback : src}
      {...props}
    />
  )
}

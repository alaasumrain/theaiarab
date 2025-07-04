"use client"

import { Brain, Sparkles, Zap, Globe, Code, Palette, Search, Mic, Camera, FileText, MessageSquare, PenTool, Music } from "lucide-react"
import { ImageWithFallback } from "@/components/cult/fallback-image"
import { cn } from "@/lib/utils"

interface ProductLogoProps {
  logo_src?: string | null
  tool_type?: string
  codename: string
  arabic_name?: string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showFallbackIcon?: boolean
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8", 
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24"
}

const categoryIcons = {
  'text-generation': Brain,
  'image-generation': Sparkles,
  'video-generation': Camera,
  'code-assistant': Code,
  'productivity': Zap,
  'design': Palette,
  'search-engine': Search,
  'ai-writing': PenTool,
  'ai-image': Sparkles,
  'ai-video': Camera,
  'ai-audio': Music,
  'ai-code': Code,
  'ai-chat': MessageSquare,
  'voice-assistant': Mic,
  'document': FileText,
  'chatbot': MessageSquare,
  'تطوير': Code,
  'تصميم': Palette,
  'كتابة': PenTool,
  'صوت': Music,
  'فيديو': Camera,
  'محادثة': MessageSquare
}

function getStorageBucketUrl(logo_src: string): string {
  // If already a full URL (external or storage), return as is
  if (logo_src.startsWith('http') || logo_src.startsWith('/')) {
    return logo_src
  }
  
  // If it's just a filename, construct storage bucket URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, using fallback')
    return '/placeholder.png'
  }
  
  return `${supabaseUrl}/storage/v1/object/public/product-logos/${logo_src}`
}

export function ProductLogo({ 
  logo_src, 
  tool_type, 
  codename, 
  arabic_name,
  className,
  size = 'md',
  showFallbackIcon = true
}: ProductLogoProps) {
  const Icon = categoryIcons[tool_type as keyof typeof categoryIcons] || Brain
  const displayName = arabic_name || codename
  const sizeClass = sizeClasses[size]

  // For now, always use placeholder icons until proper logos are uploaded
  // This prevents external URL errors and provides consistent UI
  // TODO: Re-enable logo loading once proper logos are uploaded to storage

  // Fallback to icon if no logo and showFallbackIcon is true
  if (showFallbackIcon) {
    return (
      <div className={cn(
        "rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0",
        sizeClass,
        className
      )}>
        <Icon className={cn(
          "text-primary",
          size === 'xs' ? "w-3 h-3" :
          size === 'sm' ? "w-4 h-4" :
          size === 'md' ? "w-6 h-6" :
          size === 'lg' ? "w-8 h-8" : "w-12 h-12"
        )} />
      </div>
    )
  }

  // Return empty div if no logo and no fallback icon
  return null
} 
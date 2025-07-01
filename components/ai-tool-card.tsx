"use client"

import { useOptimistic } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Eye, Globe, DollarSign, Sparkles, Zap, Brain } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cult/minimal-card"
import { incrementClickCount } from "@/app/actions/product"

interface AITool {
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
  // AI specific fields
  tool_type?: string
  difficulty_level?: string
  language_support?: string[]
  is_free?: boolean
  arabic_name?: string
  arabic_description?: string
  pricing_model?: string
}

const difficultyColors = {
  'مبتدئ': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'متوسط': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'متقدم': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const categoryIcons = {
  'text-generation': Brain,
  'image-generation': Sparkles,
  'video-generation': Zap,
  'code-assistant': Brain,
  'productivity': Zap,
  'design': Sparkles,
  'search-engine': Globe
}

export const AIToolCard: React.FC<{
  trim?: boolean
  data: AITool
  order: any
  context?: string
}> = ({ trim, data, order, context = "products" }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    AITool,
    Partial<AITool>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties }
  })

  const handleClick = () => {
    const newClickCount = (optimisticResource.view_count || 0) + 1
    addOptimisticUpdate({ view_count: newClickCount })
    incrementClickCount(data.id)
  }

  const Icon = categoryIcons[data.tool_type as keyof typeof categoryIcons] || Brain

  return (
    <motion.div
      key={`ai-tool-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative break-inside-avoid w-full"
    >
      <Link
        href={`/products/${data.id}?from=${context}`}
        key={`/products/${data.id}`}
        className=""
        onClick={handleClick}
      >
        <div className="w-full">
          <MinimalCard
            className={cn(
              "w-full transition-all duration-300 hover:shadow-lg",
              optimisticResource.view_count > 350
                ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent"
                : ""
            )}
          >
            <div className="flex items-start gap-3">
              {data.logo_src ? (
                <MinimalCardImage 
                  alt={data.arabic_name || data.codename} 
                  src={data.logo_src} 
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <MinimalCardTitle className="text-lg font-bold mb-1">
                      {data.arabic_name || data.codename}
                    </MinimalCardTitle>
                    {data.arabic_name && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {data.codename}
                      </p>
                    )}
                  </div>
                  
                  {data.is_free !== undefined && (
                    <Badge variant={data.is_free ? "default" : "secondary"} className="mr-2">
                      {data.is_free ? "مجاني" : "مدفوع"}
                    </Badge>
                  )}
                </div>
                
                <MinimalCardDescription className="text-sm leading-relaxed mb-3">
                  {data.arabic_description || data.punchline}
                </MinimalCardDescription>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {data.difficulty_level && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", difficultyColors[data.difficulty_level as keyof typeof difficultyColors])}
                    >
                      {data.difficulty_level}
                    </Badge>
                  )}
                  
                  {data.categories && (
                    <Badge variant="outline" className="text-xs">
                      {data.categories}
                    </Badge>
                  )}
                  
                  {data.language_support?.includes('Arabic') && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      يدعم العربية
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <MinimalCardFooter>
              <div className="flex items-center justify-between w-full mt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{optimisticResource.view_count || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>4.5</span>
                  </div>
                </div>
                
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-xs text-primary font-medium"
                >
                  استكشف ←
                </motion.span>
              </div>
            </MinimalCardFooter>
          </MinimalCard>
        </div>
      </Link>
    </motion.div>
  )
}
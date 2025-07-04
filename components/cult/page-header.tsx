import { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  backHref?: string
  backLabel?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  stats?: {
    label: string
    value: string | number
  }[]
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  backHref,
  backLabel = "العودة للرئيسية",
  badge,
  stats,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 px-4", className)}>
      {/* Back Navigation */}
      {backHref && (
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-right">
            <Link href={backHref} className="flex items-center gap-2 hover:bg-accent transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      {/* Title Section */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          {Icon && <Icon className={cn("h-12 w-12", iconColor)} />}
          <h1 className="text-4xl font-bold">{title}</h1>
          {badge && (
            <Badge variant={badge.variant || "default"} className="text-sm">
              {badge.text}
            </Badge>
          )}
        </div>
        
        {description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom content */}
      {children}
    </div>
  )
} 
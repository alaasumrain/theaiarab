import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
  background?: "default" | "muted"
  padding?: "none" | "sm" | "md" | "lg"
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-8xl",
  full: "max-w-full"
}

const paddingClasses = {
  none: "",
  sm: "py-4",
  md: "py-8", 
  lg: "py-12"
}

export function PageLayout({
  children,
  maxWidth = "lg",
  className,
  background = "default",
  padding = "md"
}: PageLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen",
      background === "muted" ? "bg-muted/30" : "bg-background",
      className
    )}>
      <div className={cn(
        "container mx-auto px-4",
        maxWidthClasses[maxWidth],
        paddingClasses[padding]
      )}>
        {children}
      </div>
    </div>
  )
} 
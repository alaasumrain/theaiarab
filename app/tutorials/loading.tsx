import { ListSkeleton } from "@/components/ui/loading"
import { AdaptiveLayout } from "@/components/adaptive-layout"

export default function TutorialsLoading() {
  return (
    <AdaptiveLayout className="py-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-10 bg-muted rounded w-24 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-72 mx-auto"></div>
        </div>
        
        {/* Tutorials Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListSkeleton count={4} />
        </div>
      </div>
    </AdaptiveLayout>
  )
}
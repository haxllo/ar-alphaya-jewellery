export default function ProductCardSkeleton() {
  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 relative">
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
        </div>
        
        {/* Materials */}
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        
        {/* Price */}
        <div className="h-5 bg-gray-300 rounded w-1/4" />
        
        {/* Tags */}
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

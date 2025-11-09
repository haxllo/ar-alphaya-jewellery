export default function CartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                  
                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-300 rounded w-1/3" />
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="h-10 bg-gray-200 rounded w-32" />
                      <div className="h-8 w-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary Skeleton */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-300 rounded" />
            </div>
            
            <div className="h-12 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

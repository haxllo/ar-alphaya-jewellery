'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRecentlyViewedStore } from '@/lib/store/recentlyViewed'
import { usePriceFormatter } from '@/hooks/useCurrency'

interface RecentlyViewedProps {
  limit?: number
  excludeProductId?: string
  className?: string
}

export default function RecentlyViewed({ 
  limit = 6, 
  excludeProductId,
  className = '' 
}: RecentlyViewedProps) {
  const { formatPrice } = usePriceFormatter()
  const [mounted, setMounted] = useState(false)
  const products = useRecentlyViewedStore((state) => state.getRecentProducts(limit))
  const clearHistory = useRecentlyViewedStore((state) => state.clearHistory)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter out current product
  const filteredProducts = excludeProductId 
    ? products.filter(p => p.id !== excludeProductId)
    : products

  if (filteredProducts.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-black">Recently Viewed</h2>
        <button
          onClick={clearHistory}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-2">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
              {product.name}
            </h3>
            <p className="text-sm font-semibold text-black">{formatPrice(product.price)}</p>
            <p className="text-xs text-gray-500 capitalize">{product.category.replace('-', ' ')}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

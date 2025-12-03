'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useComparisonStore } from '@/lib/store/comparison'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useCartStore } from '@/lib/store/cart'

export default function ComparePage() {
  const { formatPrice } = usePriceFormatter()
  const [mounted, setMounted] = useState(false)
  const items = useComparisonStore((state) => state.items)
  const removeItem = useComparisonStore((state) => state.removeItem)
  const clearAll = useComparisonStore((state) => state.clearAll)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-soft rounded w-1/4 mb-8" />
          <div className="h-96 bg-white border border-metal-gold/20 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-soft rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-deep-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-normal mb-4 text-deep-black">No Products to Compare</h1>
          <p className="text-deep-black/70 mb-8">Add products to comparison using the compare button on product pages.</p>
          
          <Link 
            href="/collections/rings" 
            className="inline-block rounded-full bg-deep-black px-8 py-3 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep"
          >
            Browse Collections
          </Link>
        </div>
      </main>
    )
  }

  const specs = [
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-deep-black">Compare Products</h1>
        <button
          onClick={clearAll}
          className="text-sm text-deep-black/50 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full border-collapse bg-white rounded-2xl shadow-subtle border border-metal-gold/20 overflow-hidden">
          <thead>
            <tr className="border-b border-metal-gold/20">
              <th className="p-3 sm:p-4 text-left bg-neutral-soft font-semibold text-deep-black sticky left-0 z-10 text-sm sm:text-base">
                Specification
              </th>
              {items.map((item) => (
                <th key={item.id} className="p-2 sm:p-3 lg:p-4 min-w-[150px] sm:min-w-[200px] lg:min-w-[250px]">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="250px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">{item.name}</h3>
                    <div className="flex gap-1 sm:gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-800 underline text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] sm:text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-b border-gray-200">
              <td className="p-2 sm:p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 text-xs sm:text-sm">Price</td>
              {items.map((item) => (
                <td key={item.id} className="p-2 sm:p-3 lg:p-4 text-center">
                  <span className="text-sm sm:text-base lg:text-lg font-semibold text-black">{formatPrice(item.price)}</span>
                </td>
              ))}
            </tr>

            {/* Category Row */}
            <tr className="border-b border-gray-200">
              <td className="p-2 sm:p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 text-xs sm:text-sm">Category</td>
              {items.map((item) => (
                <td key={item.id} className="p-2 sm:p-3 lg:p-4 text-center capitalize text-gray-700 text-xs sm:text-sm">
                  {item.category.replace('-', ' ')}
                </td>
              ))}
            </tr>

            {/* Actions Row */}
            <tr>
              <td className="p-2 sm:p-3 lg:p-4 font-medium text-gray-900 bg-gray-50 sticky left-0 z-10 text-xs sm:text-sm">Actions</td>
              {items.map((item) => (
                <td key={item.id} className="p-2 sm:p-3 lg:p-4">
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        addToCart({
                          productId: item.id,
                          slug: item.slug,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                          image: item.image
                        })
                      }}
                      className="w-full bg-black text-white py-1.5 sm:py-2 rounded-lg hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-full border border-gray-300 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-center"
                    >
                      <span className="hidden sm:inline">View Product</span>
                      <span className="sm:hidden">View</span>
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Continue Shopping */}
      <div className="mt-12 text-center">
        <Link
          href="/collections/rings"
          className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-deep-black-900"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  )
}

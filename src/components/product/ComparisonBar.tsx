'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useComparisonStore } from '@/lib/store/comparison'
import { usePriceFormatter } from '@/hooks/useCurrency'

export default function ComparisonBar() {
  const { formatPrice } = usePriceFormatter()
  const [mounted, setMounted] = useState(false)
  const items = useComparisonStore((state) => state.items)
  const removeItem = useComparisonStore((state) => state.removeItem)
  const clearAll = useComparisonStore((state) => state.clearAll)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 shadow-2xl transition-transform duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-600 hover:text-gray-900"
              aria-label={isMinimized ? 'Expand comparison bar' : 'Minimize comparison bar'}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <h3 className="text-sm font-semibold text-gray-900">
              Compare Products ({items.length}/4)
            </h3>
          </div>

          {/* Products */}
          {!isMinimized && (
            <div className="flex-1 flex items-center gap-3 overflow-x-auto">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 pr-3 min-w-[200px]"
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.name} from comparison`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isMinimized && (
              <>
                <Link
                  href="/compare"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Compare Now
                </Link>
                <button
                  onClick={clearAll}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

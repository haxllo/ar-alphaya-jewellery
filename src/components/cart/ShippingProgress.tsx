'use client'

import { usePriceFormatter } from '@/hooks/useCurrency'

interface ShippingProgressProps {
  subtotal: number
  freeShippingThreshold?: number
}

export default function ShippingProgress({ 
  subtotal, 
  freeShippingThreshold = 5000 
}: ShippingProgressProps) {
  const { formatPrice } = usePriceFormatter()
  const remaining = Math.max(0, freeShippingThreshold - subtotal)
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const hasQualified = subtotal >= freeShippingThreshold

  return (
    <div className="bg-green-50/50 border border-metal-gold/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-metal-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div className="flex-1">
          {hasQualified ? (
            <p className="text-sm font-medium text-deep-black">
              Free shipping within Sri Lanka
            </p>
          ) : (
            <p className="text-sm font-medium text-deep-black">
              Spend <strong>{formatPrice(remaining)}</strong> more to get <strong>free shipping</strong> within Sri Lanka
            </p>
          )}
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="h-2 bg-metal-gold/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-metal-gold rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { CartItem } from './checkout-types'

interface MobileOrderSummaryProps {
  items: CartItem[]
  subtotal: number
  discount?: number
  shipping: number
  total: number
  formatPrice: (price: number) => string
}

export default function MobileOrderSummary({
  items,
  subtotal,
  discount = 0,
  shipping,
  total,
  formatPrice,
}: MobileOrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Card className="lg:hidden">
      {/* Collapsed Header - Always Visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium">
              Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </p>
            <p className="text-xs text-gray-600">
              {isExpanded ? 'Tap to hide details' : 'Tap to view details'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tabular-nums">
            {formatPrice(total)}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="animate-in slide-in-from-top-2 border-t px-4 pb-4">
          {/* Order Items */}
          <div className="space-y-3 pt-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size || 'default'}`}
                className="flex gap-3"
              >
                {/* Product Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between text-sm">
                  <div>
                    <h4 className="font-medium leading-tight">{item.name}</h4>
                    {item.size && (
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                    <span className="font-semibold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className={`tabular-nums ${shipping === 0 ? 'text-green-600 font-medium' : ''}`}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

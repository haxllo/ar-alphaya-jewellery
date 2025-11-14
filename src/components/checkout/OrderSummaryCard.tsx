'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Tag, Lock } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { CartItem } from './checkout-types'

interface OrderSummaryCardProps {
  items: CartItem[]
  subtotal: number
  discount?: number
  shipping: number
  total: number
  formatPrice: (price: number) => string
  promoCode?: { code: string; discount: number; type: 'percentage' | 'fixed' } | null
}

export default function OrderSummaryCard({
  items,
  subtotal,
  discount = 0,
  shipping,
  total,
  formatPrice,
  promoCode,
}: OrderSummaryCardProps) {
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) return
    setIsApplying(true)
    // TODO: Implement promo code API call
    setTimeout(() => {
      setIsApplying(false)
      alert('Promo code feature coming soon!')
    }, 1000)
  }

  return (
    <Card className="lg:sticky lg:top-24 lg:h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size || 'default'}`}
              className="flex gap-4"
            >
              {/* Product Image */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium leading-tight">
                    {item.name}
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                    {item.size && (
                      <span className="rounded bg-gray-100 px-2 py-0.5">
                        Size: {item.size}
                      </span>
                    )}
                    {item.gemstone && (
                      <span className="rounded bg-gray-100 px-2 py-0.5">
                        {item.gemstone}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Promo Code */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4" />
            Have a promo code?
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
              placeholder="PROMO CODE"
              className="flex-1 uppercase"
              disabled={isApplying}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleApplyPromo}
              disabled={!promoCodeInput.trim() || isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Apply promo codes in your cart before checkout
          </p>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="tabular-nums">{formatPrice(subtotal)}</span>
          </div>
          
          {discount > 0 && promoCode && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Discount ({promoCode.code})</span>
              <span className="tabular-nums">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className={`tabular-nums ${shipping === 0 ? 'text-green-600 font-medium' : ''}`}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
        </div>

        <Separator />

        {/* Trust Badges */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Secure checkout • SSL encrypted</span>
          </div>
          
          <p className="text-xs text-gray-500">
            Your payment information is protected
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

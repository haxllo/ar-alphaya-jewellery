'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { CartItem } from '@/types/product'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { fixUploadcareUrl } from '@/lib/fix-uploadcare-url'

interface CartItemProps {
  item: CartItem
  isRemoving: boolean
  onQuantityChange: (productId: string, newQuantity: number, size?: string) => void
  onRemove: (productId: string, size?: string) => void
}

export function CartItemOne({ 
  item, 
  isRemoving, 
  onQuantityChange, 
  onRemove 
}: CartItemProps) {
  const { formatPrice } = usePriceFormatter()
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 99) {
      setQuantity(newQuantity)
      onQuantityChange(item.productId, newQuantity, item.size)
    }
  }

  const platingLabel = item.plating === '24k-gold' 
    ? '24K Gold Plated' 
    : item.plating === '18k-rose-gold' 
    ? '18K Rose Gold Plated' 
    : '925 Sterling Silver'

  return (
    <div 
      className={`group flex gap-4 rounded-2xl border border-amber-mirage-200 bg-white/80 p-4 transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Product Image */}
      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-amber-mirage-100 transition-transform duration-300 hover:scale-105">
          {item.image ? (
            <Image
              src={fixUploadcareUrl(item.image)}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-amber-mirage-300">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/products/${item.slug}`}>
              <h3 className="font-serif text-lg text-amber-mirage-brown transition-colors hover:text-amber-mirage-gold">
                {item.name}
              </h3>
            </Link>
            <div className="mt-1 space-y-0.5">
              {item.size && (
                <p className="text-sm text-amber-mirage-600">Size: {item.size}</p>
              )}
              {item.plating && (
                <p className="text-sm text-amber-mirage-600">Plating: {platingLabel}</p>
              )}
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-semibold text-amber-mirage-brown">
              {formatPrice(item.price)}
            </p>
            <p className="text-sm text-amber-mirage-500">
              {formatPrice(item.price * quantity)} total
            </p>
          </div>
        </div>
        
        {/* Quantity Controls & Remove */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-amber-mirage-200 bg-white">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="flex h-9 w-9 items-center justify-center text-amber-mirage-600 transition-colors hover:bg-amber-mirage-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRemoving || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="min-w-[2rem] text-center text-sm font-medium text-amber-mirage-brown">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="flex h-9 w-9 items-center justify-center text-amber-mirage-600 transition-colors hover:bg-amber-mirage-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRemoving || quantity >= 99}
              aria-label="Increase quantity"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.productId, item.size)}
            className="text-sm text-amber-mirage-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRemoving}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

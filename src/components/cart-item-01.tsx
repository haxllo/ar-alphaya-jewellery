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

  return (
    <div 
      className={`group flex gap-4 rounded-2xl border border-metal-gold/20 bg-white/80 p-4 transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Product Image */}
      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-neutral-soft transition-transform duration-300 hover:scale-105">
          {item.image ? (
            <Image
              src={fixUploadcareUrl(item.image)}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-deep-black/20">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        {/* Product Name and Total Price */}
        <div className="flex items-start justify-between gap-4">
          <Link href={`/products/${item.slug}`} className="flex-1">
            <h3 className="font-serif text-lg text-deep-black transition-colors hover:text-metal-gold">
              {item.name}
            </h3>
          </Link>
          <p className="text-lg font-semibold text-metal-gold-brown whitespace-nowrap">
            {formatPrice(item.price * quantity)}
          </p>
        </div>
        
        {/* Size and Plating Info */}
        <div className="mt-1 space-y-0.5">
          {item.size && (
            <p className="text-sm text-deep-black/70">Size: {item.size}</p>
          )}
          {(item.platingLabel || item.plating) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-deep-black/70">
                Plating: {item.platingLabel || (item.plating === '24k-gold' ? '24K Gold Plated' : item.plating === '18k-rose-gold' ? '18K Rose Gold Plated' : '925 Sterling Silver')}
              </p>
              {item.platingAdjustment && item.platingAdjustment > 0 && (
                <p className="text-sm text-deep-black/70">+{formatPrice(item.platingAdjustment)}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Quantity Controls & Remove */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-metal-gold-200 bg-white">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="flex h-9 w-9 items-center justify-center text-metal-gold-600 transition-colors hover:bg-metal-gold-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isRemoving || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="min-w-[2rem] text-center text-sm font-medium text-metal-gold-brown">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="flex h-9 w-9 items-center justify-center text-metal-gold-600 transition-colors hover:bg-metal-gold-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="text-sm text-deep-black/50 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRemoving}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

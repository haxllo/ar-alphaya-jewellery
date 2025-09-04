'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { CartItem } from '@/types/product'

interface CartItemProps {
  item: CartItem
  isRemoving: boolean
  onQuantityChange: (productId: string, newQuantity: number, size?: string) => void
  onRemove: (productId: string, size?: string) => void
}

export default function CartItemComponent({ 
  item, 
  isRemoving, 
  onQuantityChange, 
  onRemove 
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    onQuantityChange(item.productId, newQuantity, item.size)
  }

  const handleDirectQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1
    if (newQuantity > 0 && newQuantity <= 99) {
      handleQuantityChange(newQuantity)
    }
  }

  return (
    <div 
      className={`flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/products/${item.slug}`}>
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-black">
              <Link href={`/products/${item.slug}`} className="hover:text-gray-600 transition-colors">
                {item.name}
              </Link>
            </h3>
            {item.size && (
              <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
            )}
            <p className="text-lg font-semibold text-black mt-2">
              Rs {item.price.toLocaleString()}
            </p>
            
            {/* Stock Status */}
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600">In stock</span>
            </div>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center">
              <label htmlFor={`quantity-${item.productId}-${item.size}`} className="sr-only">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRemoving || quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <input
                  id={`quantity-${item.productId}-${item.size}`}
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={handleDirectQuantityChange}
                  className="w-16 px-2 py-2 text-center font-medium text-black border-none focus:outline-none focus:ring-0"
                  disabled={isRemoving}
                />
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRemoving || quantity >= 99}
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.productId, item.size)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRemoving}
              aria-label="Remove item from cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Item Total and Save for Later */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-4">
            <button
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              disabled={isRemoving}
            >
              Save for later
            </button>
            <button
              className="text-sm text-gray-600 hover:text-black transition-colors"
              disabled={isRemoving}
            >
              Move to wishlist
            </button>
          </div>
          
          <div className="flex flex-col sm:items-end">
            <span className="text-sm text-gray-600">Item total:</span>
            <span className="text-lg font-semibold text-black">
              Rs {(item.price * quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

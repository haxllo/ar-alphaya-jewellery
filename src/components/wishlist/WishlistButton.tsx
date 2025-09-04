'use client'

import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlistStore } from '@/lib/store/wishlist'
import type { Product } from '@/types/product'

interface WishlistButtonProps {
  product: Product
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function WishlistButton({
  product,
  className = '',
  showLabel = false,
  size = 'md'
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const [isLoading, setIsLoading] = useState(false)
  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    
    try {
      if (inWishlist) {
        removeItem(product.id)
      } else {
        addItem(product)
      }
      
      // Brief delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error('Error updating wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        ${buttonSizeClasses[size]}
        ${showLabel ? 'flex items-center gap-2' : ''}
        ${inWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-110 active:scale-95
        ${className}
      `}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      ) : inWishlist ? (
        <HeartSolidIcon className={`${sizeClasses[size]} text-red-500`} />
      ) : (
        <HeartIcon className={`${sizeClasses[size]}`} />
      )}
      
      {showLabel && !isLoading && (
        <span className="text-sm font-medium">
          {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
      
      {showLabel && isLoading && (
        <span className="text-sm font-medium">
          {inWishlist ? 'Removing...' : 'Adding...'}
        </span>
      )}
    </button>
  )
}

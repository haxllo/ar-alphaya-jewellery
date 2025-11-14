'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useCartStore } from '@/lib/store/cart'
import type { Product, GemstoneOption } from '@/types/product'
import { ShoppingCart, Zap } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface AddToCartProps {
  product: Product
  selectedSize?: string
  selectedGemstone?: GemstoneOption | null
}

export default function AddToCart({ product, selectedSize = '', selectedGemstone }: AddToCartProps) {
  const quantity = 1 // Fixed quantity of 1
  const [isAdding, setIsAdding] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()

  // Calculate final price with gemstone adjustment
  const getFinalPrice = () => {
    const basePrice = product.price
    const adjustment = selectedGemstone?.priceAdjustment || 0
    return basePrice + adjustment
  }

  const validateSelection = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return false
    }

    if (product.gemstones && product.gemstones.length > 0 && !selectedGemstone) {
      alert('Please select a gemstone')
      return false
    }

    return true
  }

  const addToCartInternal = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: getFinalPrice(),
      quantity,
      size: selectedSize,
      image: product.images?.[0],
      gemstone: selectedGemstone?.name,
    })
    try { 
      analytics.addToCart({ 
        id: product.id, 
        name: product.name, 
        category: product.category, 
        price: getFinalPrice(), 
        currency: product.currency || 'LKR' 
      }, quantity) 
    } catch {}
  }

  const handleAddToCart = async () => {
    if (!validateSelection()) return

    setIsAdding(true)
    
    try {
      addToCartInternal()
      // Brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!validateSelection()) return

    setIsBuyingNow(true)
    
    try {
      // Add to cart
      addToCartInternal()
      
      // Brief delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Redirect to cart page (user can review before checkout)
      router.push('/cart')
    } catch (error) {
      console.error('Buy now error:', error)
      setIsBuyingNow(false)
    }
  }

  const canAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return false
    if (product.gemstones && product.gemstones.length > 0 && !selectedGemstone) return false
    return true
  }

  return (
    <div className="space-y-3">
      {/* Buy Now Button - Primary CTA */}
      <button
        onClick={handleBuyNow}
        disabled={!canAddToCart() || isBuyingNow}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
          canAddToCart() && !isBuyingNow
            ? 'bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label={isBuyingNow ? 'Adding to cart...' : 'Buy now'}
      >
        <ShoppingCart className={`h-5 w-5 ${isBuyingNow ? 'animate-pulse' : ''}`} />
        {isBuyingNow ? (
          'Adding to Cart...'
        ) : (
          'Buy Now'
        )}
      </button>

      {/* Add to Cart Button - Secondary */}
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart() || isAdding || isBuyingNow}
        className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg font-semibold text-base transition-all border-2 ${
          canAddToCart() && !isAdding && !isBuyingNow
            ? 'border-black text-black hover:bg-gray-50'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label={isAdding ? 'Adding to cart...' : 'Add to cart'}
      >
        <ShoppingCart className={`h-5 w-5 ${isAdding ? 'animate-bounce' : ''}`} />
        {isAdding ? (
          'Adding to Cart...'
        ) : (
          'Add to Cart'
        )}
      </button>

      {!canAddToCart() && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {product.sizes && product.sizes.length > 0 && !selectedSize && 'Please select a size'}
          {product.gemstones && product.gemstones.length > 0 && !selectedGemstone && 'Please select a gemstone'}
        </div>
      )}
    </div>
  )
}

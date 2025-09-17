'use client'

import { useState } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useCartStore } from '@/lib/store/cart'
import type { Product, GemstoneOption } from '@/types/product'
import { ShoppingCart } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface AddToCartProps {
  product: Product
  selectedSize?: string
  selectedGemstone?: GemstoneOption | null
}

export default function AddToCart({ product, selectedSize = '', selectedGemstone }: AddToCartProps) {
  const quantity = 1 // Fixed quantity of 1
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Calculate final price with gemstone adjustment
  const getFinalPrice = () => {
    const basePrice = product.price
    const adjustment = selectedGemstone?.priceAdjustment || 0
    return basePrice + adjustment
  }

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }

    if (product.gemstones && product.gemstones.length > 0 && !selectedGemstone) {
      alert('Please select a gemstone')
      return
    }

    setIsAdding(true)
    
    try {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: getFinalPrice(),
        quantity,
        size: selectedSize,
        image: product.images?.[0],
        // Store gemstone info in a way the cart can understand
        gemstone: selectedGemstone?.name,
      })
      try { trackEvent('add_to_cart', { productId: product.id, slug: product.slug, price: getFinalPrice(), quantity, size: selectedSize, gemstone: selectedGemstone?.name }) } catch {}
      
      // Brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAdding(false)
    }
  }

  const canAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return false
    if (product.gemstones && product.gemstones.length > 0 && !selectedGemstone) return false
    return true
  }

  return (
    <div className="space-y-4">

      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart() || isAdding}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
          canAddToCart() && !isAdding
            ? 'bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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

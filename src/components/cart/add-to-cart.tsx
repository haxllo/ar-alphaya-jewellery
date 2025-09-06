'use client'

import { useState } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useCartStore } from '@/lib/store/cart'
import type { Product, GemstoneOption } from '@/types/product'
import { ShoppingCart } from 'lucide-react'

interface AddToCartProps {
  product: Product
  selectedSize?: string
  selectedGemstone?: GemstoneOption | null
}

export default function AddToCart({ product, selectedSize = '', selectedGemstone }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { formatPrice } = usePriceFormatter()
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
      <div>
        <label htmlFor="quantity" className="block text-sm font-semibold mb-2 text-primary-800">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-primary-300 flex items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="text-lg font-medium text-primary-800 min-w-[2rem] text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-10 h-10 rounded-lg border border-primary-300 flex items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
            disabled={quantity >= 10}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart() || isAdding}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
          canAddToCart() && !isAdding
            ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-primary-200 text-primary-400 cursor-not-allowed'
        }`}
      >
        <ShoppingCart className={`h-5 w-5 ${isAdding ? 'animate-bounce' : ''}`} />
        {isAdding ? (
          'Adding to Cart...'
        ) : (
          `Add to Cart • ${formatPrice(getFinalPrice() * quantity)}`
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

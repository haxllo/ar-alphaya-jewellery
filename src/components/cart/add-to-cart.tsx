'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import SizeGuideModal from '@/components/product/SizeGuideModal'
import type { Product } from '@/types/product'

interface AddToCartProps {
  product: Product
}

export default function AddToCart({ product }: AddToCartProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value || '')
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      image: product.images[0],
    })
  }

  // Determine product type for size guide
  const getProductType = (): 'rings' | 'bracelets' | 'necklaces' | 'earrings' => {
    const category = product.category?.toLowerCase() || ''
    if (category.includes('ring')) return 'rings'
    if (category.includes('bracelet') || category.includes('bangle')) return 'bracelets'
    if (category.includes('necklace') || category.includes('pendant')) return 'necklaces'
    return 'earrings'
  }

  return (
    <div className="space-y-4">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="size" className="block text-sm font-medium text-black">
              Size
            </label>
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Size Guide
            </button>
          </div>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            {product.sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-2 text-black">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors"
      >
        Add to Cart - Rs {product.price.toLocaleString()}
      </button>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productType={getProductType()}
      />
    </div>
  )
}

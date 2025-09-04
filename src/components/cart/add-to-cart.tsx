'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import type { Product } from '@/types/product'

interface AddToCartProps {
  product: Product
}

export default function AddToCart({ product }: AddToCartProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value || '')
  const [quantity, setQuantity] = useState(1)
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

  return (
    <div className="space-y-4">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-2 text-black">
            Size
          </label>
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
    </div>
  )
}

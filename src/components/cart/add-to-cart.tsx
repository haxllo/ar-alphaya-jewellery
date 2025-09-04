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
          <label htmlFor="size" className="block text-sm font-medium mb-2">
            Size
          </label>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full border rounded px-3 py-2"
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
        <label htmlFor="quantity" className="block text-sm font-medium mb-2">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
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
        className="w-full bg-black text-white py-3 px-6 rounded hover:bg-neutral-800"
      >
        Add to Cart - Rs {product.price.toLocaleString()}
      </button>
    </div>
  )
}

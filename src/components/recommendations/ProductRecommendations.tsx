'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product, CartItem } from '@/types/product'
import { useCartStore } from '@/lib/store/cart'

interface ProductRecommendationsProps {
  products: Product[]
  title?: string
  showQuickAdd?: boolean
  className?: string
}

export default function ProductRecommendations({ 
  products, 
  title = "You might also like",
  showQuickAdd = true,
  className = ""
}: ProductRecommendationsProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())

  const handleQuickAdd = async (product: Product) => {
    if (addingItems.has(product.id)) return

    setAddingItems(prev => new Set(prev).add(product.id))

    const cartItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || undefined
    }

    // Add a small delay for better UX feedback
    setTimeout(() => {
      addItem(cartItem)
      setAddingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 500)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-semibold mb-6 text-black">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isAdding = addingItems.has(product.id)
          
          return (
            <div 
              key={product.id} 
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Rs {product.price.toLocaleString()}
                </p>
                {product.materials && product.materials.length > 0 && (
                  <p className="text-xs text-gray-500 capitalize">
                    {product.materials.join(', ')}
                  </p>
                )}
              </Link>
              
              {showQuickAdd && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleQuickAdd(product)
                  }}
                  disabled={isAdding}
                  className={`mt-3 w-full py-2 px-4 rounded text-sm font-medium transition-all duration-300 ${
                    isAdding 
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-gray-100 text-black hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Quick Add'
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Product } from '@/types/product'

interface ProductComparisonProps {
  products: Product[]
  onRemove: (productId: string) => void
  onClear: () => void
}

export default function ProductComparison({ products, onRemove, onClear }: ProductComparisonProps) {
  const { formatPrice } = usePriceFormatter()

  if (products.length === 0) {
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
        <Plus className="h-12 w-12 text-primary-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary-800 mb-2">No products to compare</h3>
        <p className="text-primary-600">Add products to compare their features side by side</p>
      </div>
    )
  }

  const getProductSpecs = (product: Product) => [
    { label: 'Price', value: formatPrice(product.price) },
    { label: 'Category', value: product.category },
    { label: 'Materials', value: product.materials?.join(', ') || 'N/A' },
    { label: 'Weight', value: product.weight ? `${product.weight}g` : 'N/A' },
    { label: 'Dimensions', value: product.dimensions || 'N/A' },
    { label: 'In Stock', value: product.inStock ? 'Yes' : 'No' },
    { label: 'SKU', value: product.sku || 'N/A' },
  ]

  return (
    <div className="bg-white border border-primary-200 rounded-lg overflow-hidden">
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-800">
            Compare Products ({products.length})
          </h2>
          <button
            onClick={onClear}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Product Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="aspect-square bg-primary-100 rounded-lg mb-4 overflow-hidden relative">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-400">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-primary-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="text-lg font-bold text-primary-700">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="border-t border-primary-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {getProductSpecs(products[0]).map((spec, index) => (
                <div key={index} className="space-y-4">
                  <div className="font-medium text-primary-800 border-b border-primary-200 pb-2">
                    {spec.label}
                  </div>
                  {products.map((product) => {
                    const productSpecs = getProductSpecs(product)
                    const value = productSpecs[index]?.value || 'N/A'
                    return (
                      <div key={product.id} className="text-primary-600 min-h-[2rem] flex items-center">
                        {value}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

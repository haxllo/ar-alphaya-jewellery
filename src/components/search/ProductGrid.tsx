'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/cms'
import { useCurrency } from '@/hooks/useCurrency'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { formatPrice } = useCurrency()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No products found</h2>
        <p className="text-gray-600">
          Try adjusting your search criteria or browse all products
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Stock Status Badge */}
            {!product.inStock && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
            
            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
              {product.name}
            </h3>
            
            {/* Category */}
            <p className="text-sm text-gray-500 mb-2 capitalize">
              {product.category.replace('-', ' & ')}
            </p>
            
            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <p className="text-sm text-gray-600 mb-2">
                {product.materials.slice(0, 2).join(', ')}
                {product.materials.length > 2 && ` +${product.materials.length - 2} more`}
              </p>
            )}
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-black">
                {formatPrice(product.price)}
              </span>
              
              {/* Gemstones indicator */}
              {product.gemstones && product.gemstones.length > 0 && (
                <span className="text-xs text-gray-500">
                  {product.gemstones.length} {product.gemstones.length === 1 ? 'stone' : 'stones'}
                </span>
              )}
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{product.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

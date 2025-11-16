'use client'

import Link from 'next/link'
import { memo, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/cms'
import { useCurrency } from '@/hooks/useCurrency'
import QuickView from '@/components/product/QuickView'
import { fixUploadcareUrl } from '@/lib/fix-uploadcare-url'

interface ProductGridProps {
  products: Product[]
}

function ProductGridComponent({ products }: ProductGridProps) {
  const { formatPrice } = useCurrency()
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
          >
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setQuickViewProduct(product)
            }}
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Quick view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Product Image */}
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={fixUploadcareUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                  loading="lazy"
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
          </Link>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                {product.name}
              </h3>
            </Link>
            
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
        </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onNext={() => {
            const currentIndex = products.findIndex(p => p.id === quickViewProduct.id)
            const nextIndex = (currentIndex + 1) % products.length
            setQuickViewProduct(products[nextIndex])
          }}
          onPrev={() => {
            const currentIndex = products.findIndex(p => p.id === quickViewProduct.id)
            const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1
            setQuickViewProduct(products[prevIndex])
          }}
          hasNext={products.length > 1}
          hasPrev={products.length > 1}
        />
      )}
    </>
  )
}

export default memo(ProductGridComponent)

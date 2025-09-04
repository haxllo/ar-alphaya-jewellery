'use client'

import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import AddToCart from '@/components/cart/add-to-cart'
import type { Product } from '@/types/product'

interface ProductContentProps {
  product: Product
}

export default function ProductContent({ product }: ProductContentProps) {
  const { formatPrice } = usePriceFormatter()

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-primary-100 rounded mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-primary-100 rounded" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-semibold text-primary-800">{product.name}</h1>
            <WishlistButton product={product} size="lg" />
          </div>
          <p className="text-2xl mb-4 text-primary-700">{formatPrice(product.price)}</p>
          
          {product.materials && product.materials.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-primary-800">Materials</h3>
              <p className="text-sm text-primary-600">{product.materials.join(', ')}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2 text-primary-800">Description</h3>
            <div className="text-sm text-primary-600 whitespace-pre-wrap">{product.description}</div>
          </div>

          <AddToCart product={product} />
        </div>
      </div>
    </main>
  )
}

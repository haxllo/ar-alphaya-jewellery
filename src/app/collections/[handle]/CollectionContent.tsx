'use client'

import Link from 'next/link'
import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import type { Product } from '@/types/product'

interface CollectionContentProps {
  handle: string
  products: Product[]
}

export default function CollectionContent({ handle, products }: CollectionContentProps) {
  const { formatPrice } = usePriceFormatter()
  
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 capitalize text-black">{handle.replace('-', ' ')}</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group border border-gray-200 rounded p-3 hover:shadow-sm hover:border-gray-300 transition-all relative">
              <div className="absolute top-2 right-2 z-10">
                <WishlistButton product={p} size="sm" />
              </div>
              <Link href={`/products/${p.slug}`}>
                <div className="aspect-square bg-gray-100 rounded mb-3" />
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-black group-hover:underline">{p.name}</h3>
                  <span className="text-sm text-gray-600">{formatPrice(p.price)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

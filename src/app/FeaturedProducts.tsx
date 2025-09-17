'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import type { Product } from '@/types/product'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { formatPrice } = usePriceFormatter()

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6 text-black">Featured</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="group border border-gray-200 rounded p-3 hover:shadow-sm hover:border-gray-300 transition-all relative">
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton product={p} size="sm" />
            </div>
            <Link href={`/products/${p.slug}`}>
              <div className="aspect-square bg-gray-100 rounded mb-3 relative overflow-hidden">
                {p.images && p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black group-hover:underline">{p.name}</h3>
                <span className="text-sm text-gray-600">{formatPrice(p.price)}</span>
              </div>
              <p className="text-xs text-gray-500 capitalize">{p.category.replace('-', ' ')}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

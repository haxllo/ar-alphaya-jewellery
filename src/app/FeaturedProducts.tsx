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
    <section className="mx-auto max-w-7xl px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-nocturne-500">Current creations</p>
          <h2 className="mt-2 font-serif text-3xl text-nocturne-900 md:text-4xl">Limited pieces available to customise or claim</h2>
        </div>
        <Link href="/collections/rings" className="text-sm font-semibold text-nocturne-600 underline-offset-6 hover:text-foreground hover:underline">
          View all studio listings
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="group relative overflow-hidden rounded-3xl border border-nocturne-100 bg-white/80 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-gold-200/70 hover:shadow-luxe"
          >
            <div className="absolute right-4 top-4 z-10">
              <WishlistButton product={p} size="sm" />
            </div>
            <Link href={`/products/${p.slug}`} className="flex h-full flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-nocturne-100">
                {p.images && p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-nocturne-300">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-nocturne-400">{p.category.replace('-', ' ')}</p>
                <h3 className="font-serif text-xl text-nocturne-900 transition-colors group-hover:text-foreground">{p.name}</h3>
                <span className="text-sm font-semibold text-nocturne-600">{formatPrice(p.price)}</span>
                {(p.availability || p.leadTime) && (
                  <div className="mt-2 flex flex-col gap-1">
                    {p.availability && (
                      <span className="inline-flex w-fit items-center rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                        {p.availability.split(/[-_\s]+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}
                      </span>
                    )}
                    {p.leadTime && (
                      <span className="text-xs text-nocturne-500">Lead time: {p.leadTime}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

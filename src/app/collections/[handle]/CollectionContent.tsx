'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePriceFormatter } from '@/hooks/useCurrency'
import WishlistButton from '@/components/wishlist/WishlistButton'
import type { Product } from '@/types/product'

interface CollectionContentProps {
  handle: string
  products: Product[]
}

export default function CollectionContent({ handle, products }: CollectionContentProps) {
  const { formatPrice } = usePriceFormatter()
  const descriptors: Record<string, string> = {
    rings: 'Modern proposals, anniversaries, and self-led declarations of love.',
    earrings: 'Sculptural statements and easy, luminous studs for every day.',
    pendants: 'Keepsakes designed to rest close to the heart.',
    'bracelets-bangles': 'Articulated bracelets and hand-forged bangles made to move with you.',
  }
  const title = handle.replace('-', ' ')
  
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-10 rounded-3xl bg-white/80 p-8 shadow-subtle">
        <nav className="text-xs uppercase tracking-[0.3em] text-nocturne-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-nocturne-400" aria-current="page">{title}</li>
          </ol>
        </nav>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl capitalize text-nocturne-900 md:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-nocturne-600">
              {descriptors[handle] || 'Discover curated pieces finished by hand and tailored to your rituals.'}
            </p>
          </div>
          <div className="flex gap-3">
            <a href="#collection-grid" className="rounded-full border border-nocturne-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-nocturne-500 hover:border-gold-200 hover:text-foreground">
              View collection
            </a>
            <a href="/contact" className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5">
              Bespoke inquiry
            </a>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-nocturne-100 bg-white/80 p-12 text-center text-nocturne-500">
          We are crafting new pieces for this collection. Join our waitlist to be the first to know.
        </div>
      ) : (
        <div id="collection-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-nocturne-100 bg-white/75 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-gold-200/70 hover:shadow-luxe"
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
                      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-nocturne-400">{title}</p>
                  <h3 className="font-serif text-xl text-nocturne-900 transition-colors group-hover:text-foreground">{p.name}</h3>
                  <span className="text-sm font-semibold text-nocturne-600">{formatPrice(p.price)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

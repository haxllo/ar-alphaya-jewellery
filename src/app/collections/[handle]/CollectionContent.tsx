'use client'

import { useState } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import QuickFilters from '@/components/collection/QuickFilters'
import { ProductCardOne } from '@/components/product-card-01'
import { useCartStore } from '@/lib/store/cart'
import type { Product } from '@/types/product'

interface CollectionContentProps {
  handle: string
  products: Product[]
}

export default function CollectionContent({ handle, products }: CollectionContentProps) {
  const { formatPrice } = usePriceFormatter()
  const [activeFilter, setActiveFilter] = useState('all')
  const { addItem } = useCartStore()
  
  const descriptors: Record<string, string> = {
    rings: 'Modern proposals, anniversaries, and self-led declarations of love.',
    earrings: 'Sculptural statements and easy, luminous studs for every day.',
    pendants: 'Keepsakes designed to rest close to the heart.',
    'bracelets-bangles': 'Articulated bracelets and hand-forged bangles made to move with you.',
  }
  const title = handle.replace('-', ' ')
  
  // Filter products based on active filter
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'inStock') return product.inStock !== false
    if (activeFilter === 'onSale') return false // No sale logic yet
    if (activeFilter === 'new') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return product.createdAt && new Date(product.createdAt) > thirtyDaysAgo
    }
    if (activeFilter === 'featured') return product.featured === true
    return true
  })

  const handleAddToCart = (product: Product, quantity: number = 1, plating?: string) => {
    const platingPrice = plating === '24k-gold' ? 5000 : plating === '18k-rose-gold' ? 3000 : 0
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price + platingPrice,
      quantity,
      image: product.images?.[0] || '',
      slug: product.slug,
      plating,
    })
  }
  
  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-10 rounded-3xl bg-white/80 p-8 shadow-subtle">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }]}
          currentPage={title}
        />
        <div className="mt-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl capitalize text-nocturne-900 md:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-nocturne-600">
                {descriptors[handle] || 'Discover curated pieces finished by hand and tailored to your rituals.'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#collection-grid" className="flex items-center justify-center rounded-full border border-nocturne-200 px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-nocturne-500 hover:border-gold-200 hover:text-foreground transition-all whitespace-nowrap">
                View collection
              </a>
              <a href="/contact" className="flex items-center justify-center rounded-full bg-foreground px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
                Bespoke inquiry
              </a>
            </div>
          </div>

          {/* Quick Filters */}
          <QuickFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Product Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-nocturne-100 bg-white/80 p-12 text-center text-nocturne-500">
          {products.length === 0 
            ? 'We are crafting new pieces for this collection. Join our waitlist to be the first to know.'
            : 'No products match your filters. Try adjusting your selection.'}
        </div>
      ) : (
        <div id="collection-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 scroll-mt-24">
          {filteredProducts.map((p) => (
            <ProductCardOne key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </main>
  )
}

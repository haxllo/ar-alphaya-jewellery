'use client'

import { useState, useMemo } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import QuickFilters from '@/components/collection/QuickFilters'
import SortDropdown from '@/components/collection/SortDropdown'
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
  const [sortBy, setSortBy] = useState('featured')
  const { addItem } = useCartStore()
  
  const descriptors: Record<string, string> = {
    rings: 'Timeless symbols of forever, handcrafted with intention and care.',
    earrings: 'Elegant statements and luminous accents for every occasion.',
    pendants: 'Treasured keepsakes designed to rest close to your heart.',
    'bracelets-bangles': 'Gracefully articulated pieces that move beautifully with you.',
  }
  const title = handle.replace('-', ' ')
  
  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // Filter
    let filtered = products.filter(product => {
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

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

    return sorted
  }, [products, activeFilter, sortBy])

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
    <main className="mx-auto max-w-7xl px-0 min-[376px]:px-4 sm:px-8 py-20 bg-neutral-soft">
      {/* Header */}
      <div className="mb-16 space-y-8 px-4 min-[376px]:px-0">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }]}
          currentPage={title}
        />
        
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <h1 className="font-serif font-normal text-4xl md:text-5xl capitalize text-deep-black">{title}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-deep-black/60">
              {descriptors[handle] || 'Discover curated pieces finished by hand and tailored to your rituals.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-deep-black px-8 py-3 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep whitespace-nowrap">
              Commission Piece
            </a>
          </div>
        </div>

        {/* Filters & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-6 border-t border-metal-gold/20">
          <span className="text-sm text-deep-black/40">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <QuickFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="mx-4 min-[376px]:mx-0 rounded-2xl border border-metal-gold/20 bg-white/50 p-16 text-center">
          <p className="text-base text-deep-black/60">
            {products.length === 0 
              ? 'We are crafting new pieces for this collection.'
              : 'No products match your filters.'}
          </p>
        </div>
      ) : (
        <div id="collection-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8 scroll-mt-24 px-0">
          {filteredAndSortedProducts.map((p) => (
            <ProductCardOne key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </main>
  )
}

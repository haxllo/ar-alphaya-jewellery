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
    rings: 'Timeless symbols of forever, handcrafted with intention and care.',
    earrings: 'Elegant statements and luminous accents for every occasion.',
    pendants: 'Treasured keepsakes designed to rest close to your heart.',
    'bracelets-bangles': 'Gracefully articulated pieces that move beautifully with you.',
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
      <div className="mb-10 rounded-3xl bg-gradient-to-br from-amber-mirage-50 to-white/80 p-8 shadow-subtle border border-amber-mirage-100">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }]}
          currentPage={title}
        />
        
        {/* Title and Bespoke Button Row */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-serif text-4xl md:text-5xl capitalize text-amber-mirage-brown tracking-tight">{title}</h1>
          </div>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-mirage-brown text-amber-mirage-soft text-xs font-medium uppercase tracking-widest hover:bg-amber-mirage-brown/90 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
          >
            Custom Design
          </a>
        </div>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-amber-mirage-700">
          {descriptors[handle] || 'Discover curated pieces finished by hand and tailored to your rituals.'}
        </p>

        {/* Filters and Product Count Row */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <QuickFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          
          <div className="text-sm text-amber-mirage-600 whitespace-nowrap">
            {filteredProducts.length} of {products.length} {products.length === 1 ? 'piece' : 'pieces'}
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

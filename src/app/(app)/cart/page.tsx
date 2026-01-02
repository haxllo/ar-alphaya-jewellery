'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { CartItemOne } from '@/components/cart-item-01'
import CartSummary from '@/components/cart/cart-summary'
import CartSkeleton from '@/components/ui/skeletons/CartSkeleton'
import DeliveryEstimate from '@/components/cart/DeliveryEstimate'
import TrustBadges from '@/components/cart/TrustBadges'
import dynamic from 'next/dynamic'
const ProductRecommendations = dynamic(() => import('@/components/recommendations/ProductRecommendations'), { ssr: false })
import type { CartItem } from '@/types/product'
// Removed mock recommendations; fetch real products via API

export default function CartPage() {
  const items = useCartStore((state) => state.items) as CartItem[]
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const clearImmediate = useCartStore((state) => state.clearImmediate)
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  
  // Free shipping for all orders within Sri Lanka
  const shippingEstimate = 0
  const total = subtotal + shippingEstimate

  // Smart product recommendations: fetch contextual products from API (category/tags from cart)
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])

  async function fetchRecommendations() {
    try {
      // Derive categories and tags from items if possible
      const categories = Array.from(new Set(items.map((i) => (i as any).category).filter(Boolean)))
      const tags = Array.from(new Set(items.flatMap((i) => ((i as any).tags || []))).values())
      const body: any = { limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }
      if (categories.length > 0) body.category = categories[0]
      if (tags.length > 0) body.tags = tags.slice(0, 3)

      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) return setSuggestedProducts([])
      const json = await res.json()
      const products = (json?.data?.products || []).filter((p: any) => !items.some((i) => i.slug === p.slug))
      setSuggestedProducts(products)
    } catch {
      setSuggestedProducts([])
    }
  }

  // Load on mount and when cart empties/fills to keep simple
  // In future, derive categories from items and query accordingly
  useState(() => {
    fetchRecommendations()
  })

  const handleQuantityChange = (productId: string, newQuantity: number, size?: string) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, size)
    } else {
      setQuantity(productId, newQuantity, size)
    }
  }

  const handleRemoveItem = (productId: string, size?: string) => {
    setRemovingItem(`${productId}-${size}`)
    setTimeout(() => {
      removeItem(productId, size)
      setRemovingItem(null)
    }, 300)
  }

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear all items from your cart? This action cannot be undone.')) {
      clearImmediate()
    }
  }


  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-soft rounded-full flex items-center justify-center border border-metal-gold/10">
            <svg className="w-12 h-12 text-deep-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-normal mb-4 text-deep-black">Your cart is empty</h1>
          <p className="text-deep-black/70 mb-8">Add some beautiful jewelry to your cart and they&apos;ll show up here.</p>
          
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-deep-black-900"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Suggested Products for Empty Cart */}
        <ProductRecommendations 
          products={suggestedProducts}
          title="You might like these"
          showQuickAdd={false}
          className="mt-16 text-center"
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-14">
        <h1 className="font-serif text-3xl font-normal text-deep-black">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-sm text-deep-black/50 hover:text-red-600 transition-colors"
        >
          Clear cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const itemKey = `${item.productId}-${item.size}`
            const isRemoving = removingItem === itemKey
            
            return (
              <CartItemOne
                key={itemKey}
                item={item}
                isRemoving={isRemoving}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            )
          })}
        </div>
        
        {/* Order Summary - Sticky on Desktop */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
          <div className="border border-metal-gold/20 bg-white/80 shadow-luxe rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-medium text-deep-black">Order Summary</h2>
            
            <DeliveryEstimate />
            
            <CartSummary 
              subtotal={subtotal}
              shippingEstimate={shippingEstimate}
              total={total}
              itemCount={items.reduce((acc, i) => acc + i.quantity, 0)}
            />
            
            <TrustBadges />
          </div>
        </div>
      </div>
      
      {/* Smart Recommendations */}
      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <ProductRecommendations 
            products={suggestedProducts}
            title={items.length > 0 ? "Frequently bought together" : "Trending now"}
          />
        </div>
      )}
    </main>
  )
}


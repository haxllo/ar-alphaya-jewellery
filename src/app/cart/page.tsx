'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { CartItemOne } from '@/components/cart-item-01'
import CartSummary from '@/components/cart/cart-summary'
import CartSkeleton from '@/components/ui/skeletons/CartSkeleton'
import ShippingProgress from '@/components/cart/ShippingProgress'
import DeliveryEstimate from '@/components/cart/DeliveryEstimate'
import PromoCode from '@/components/cart/PromoCode'
import TrustBadges from '@/components/cart/TrustBadges'
import dynamic from 'next/dynamic'
const ProductRecommendations = dynamic(() => import('@/components/recommendations/ProductRecommendations'), { ssr: false })
import type { CartItem } from '@/types/product'
// Removed mock recommendations; fetch real products via API

export default function CartPage() {
  const items = useCartStore((state) => state.items) as CartItem[]
  const promoCode = useCartStore((state) => state.promoCode)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const clearImmediate = useCartStore((state) => state.clearImmediate)
  const applyPromoCode = useCartStore((state) => state.applyPromoCode)
  const removePromoCodeFromStore = useCartStore((state) => state.removePromoCode)
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  
  // Calculate discount
  const discount = promoCode
    ? promoCode.type === 'percentage'
      ? Math.round((subtotal * promoCode.discount) / 100)
      : promoCode.discount
    : 0
  
  // Free delivery within Sri Lanka for orders above Rs.5,000
  const freeShippingThreshold = 5000
  const shippingEstimate = subtotal >= freeShippingThreshold ? 0 : 1000
  const total = subtotal - discount + shippingEstimate

  // Smart product recommendations: fetch contextual products from API (category/tags from cart)
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])

  // Promo code validation
  const handleApplyPromoCode = async (code: string): Promise<{ success: boolean; message: string; discount?: number }> => {
    // Simulated promo codes - in production, this would call an API
    const validCodes: Record<string, { discount: number; type: 'percentage' | 'fixed'; message: string }> = {
      'WELCOME10': { discount: 10, type: 'percentage', message: '10% discount applied!' },
      'SAVE500': { discount: 500, type: 'fixed', message: 'Rs.500 discount applied!' },
      'FREESHIP': { discount: 1000, type: 'fixed', message: 'Free shipping applied!' },
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const promoData = validCodes[code]
    
    if (promoData) {
      applyPromoCode(code, promoData.discount, promoData.type)
      return { success: true, message: promoData.message, discount: promoData.discount }
    }
    
    return { success: false, message: 'Invalid promo code. Please try again.' }
  }

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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4 text-black">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart and they&apos;ll show up here.</p>
          
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900"
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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear all items
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Cart Items */}
        <div>
          <ShippingProgress subtotal={subtotal} freeShippingThreshold={freeShippingThreshold} />
          
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
        </div>
        
        {/* Order Summary - Sticky on Desktop */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
          <div className="border border-amber-mirage-200 bg-amber-mirage-soft/80 shadow-amber rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-amber-mirage-brown">Order Summary</h2>
            
            <DeliveryEstimate />
            
            <div className="border-t border-amber-mirage-200 pt-4">
              <PromoCode onApply={handleApplyPromoCode} />
            </div>
            
            {promoCode && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <span className="text-green-800 font-medium">
                  {promoCode.code} Applied
                </span>
                <button
                  onClick={removePromoCodeFromStore}
                  className="text-green-600 hover:text-green-800 underline"
                >
                  Remove
                </button>
              </div>
            )}
            
            <CartSummary 
              subtotal={subtotal}
              discount={discount}
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


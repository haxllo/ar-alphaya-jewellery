'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import CartItemComponent from '@/components/cart/cart-item'
import CartSummary from '@/components/cart/cart-summary'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const clear = useCartStore((state) => state.clear)
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shippingEstimate = subtotal > 500000 ? 0 : 5000 // Free shipping over Rs 500,000
  const taxEstimate = Math.round(subtotal * 0.02) // 2% tax estimate
  const total = subtotal + shippingEstimate + taxEstimate

  // Suggested products (hardcoded for now - can be made dynamic later)
  const suggestedProducts = [
    { id: 'demo-001', slug: 'sample-blue-sapphire-ring', name: 'Sample Blue Sapphire Ring', price: 250000 },
    { id: 'demo-002', slug: 'sample-diamond-earrings', name: 'Sample Diamond Stud Earrings', price: 150000 },
    { id: 'demo-003', slug: 'sample-ruby-pendant', name: 'Sample Ruby Heart Pendant', price: 180000 },
  ]

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

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
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
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Suggested Products for Empty Cart */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6 text-black text-center">You might like these</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3" />
                <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors">{product.name}</h3>
                <p className="text-gray-600 text-sm">Rs {product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-black">Shopping Cart</h1>
        <button
          onClick={() => clear()}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear all items
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6">
              <div className="space-y-6">
                {items.map((item) => {
                  const itemKey = `${item.productId}-${item.size}`
                  const isRemoving = removingItem === itemKey
                  
                  return (
                    <CartItemComponent
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
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-4">
          <CartSummary 
            subtotal={subtotal}
            shippingEstimate={shippingEstimate}
            taxEstimate={taxEstimate}
            total={total}
            itemCount={items.reduce((acc, i) => acc + i.quantity, 0)}
          />
        </div>
      </div>
      
      {/* Recently Viewed / Recommended */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-black">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedProducts.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3" />
              <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors">{product.name}</h3>
              <p className="text-gray-600 text-sm">Rs {product.price.toLocaleString()}</p>
              <button className="mt-3 w-full bg-gray-100 text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm">
                Quick Add
              </button>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}


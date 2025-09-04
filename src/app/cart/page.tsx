'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const clear = useCartStore((state) => state.clear)
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-primary-800">Your Cart</h1>
      {items.length === 0 ? (
        <div>
          <p className="text-primary-600">Your cart is empty.</p>
          <Link href="/" className="text-primary-700 underline hover:text-primary-800">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-border">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary-800">{i.name}</div>
                  {i.size && <div className="text-sm text-primary-500">Size: {i.size}</div>}
                  <div className="text-sm text-primary-600">Qty: {i.quantity}</div>
                </div>
                <div className="text-primary-700">Rs {(i.price * i.quantity).toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-medium text-primary-800">Total</span>
            <span className="text-lg font-semibold text-primary-800">Rs {total.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <Link href="/checkout" className="bg-primary-800 text-primary-50 px-4 py-2 rounded hover:bg-primary-700 transition-colors">Checkout</Link>
            <Link href="/" className="border border-border px-4 py-2 rounded text-primary-700 hover:bg-primary-100 transition-colors">Continue shopping</Link>
          </div>
        </div>
      )}
    </main>
  )
}


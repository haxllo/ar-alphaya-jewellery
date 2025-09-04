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
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link href="/" className="text-blue-600 underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{i.name}</div>
                  {i.size && <div className="text-sm text-neutral-500">Size: {i.size}</div>}
                  <div className="text-sm">Qty: {i.quantity}</div>
                </div>
                <div>Rs {(i.price * i.quantity).toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-lg font-medium">Total</span>
            <span className="text-lg font-semibold">Rs {total.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <Link href="/checkout" className="bg-black text-white px-4 py-2 rounded">Checkout</Link>
            <Link href="/" className="border px-4 py-2 rounded">Continue shopping</Link>
          </div>
        </div>
      )}
    </main>
  )
}


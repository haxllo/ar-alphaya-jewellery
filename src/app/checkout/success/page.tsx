'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const clear = useCartStore((state) => state.clear)
  
  useEffect(() => {
    // Clear cart on successful payment
    clear()
  }, [clear])
  
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-center">
      <div className="bg-green-50 p-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold text-green-800 mb-4">Payment Successful!</h1>
        <p className="text-green-700 mb-6">
          Thank you for your order. We have received your payment and will process your order shortly.
        </p>
        <p className="text-sm text-green-600 mb-8">
          A confirmation email has been sent to your email address with order details.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-black text-white px-6 py-2 rounded hover:bg-neutral-800">
            Continue Shopping
          </Link>
          <Link href="/contact" className="border border-black px-6 py-2 rounded hover:bg-neutral-50">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePriceFormatter } from '@/hooks/useCurrency'

interface CartSummaryProps {
  subtotal: number
  discount?: number
  shippingEstimate: number
  taxEstimate: number
  total: number
  itemCount: number
}

export default function CartSummary({ 
  subtotal, 
  discount = 0,
  shippingEstimate, 
  taxEstimate, 
  total, 
  itemCount 
}: CartSummaryProps) {
  const { formatPrice } = usePriceFormatter()

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600 font-medium">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Shipping</span>
        <span className={shippingEstimate === 0 ? 'text-green-600 font-medium' : ''}>
          {shippingEstimate === 0 ? 'FREE' : formatPrice(shippingEstimate)}
        </span>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Tax estimate</span>
        <span>{formatPrice(taxEstimate)}</span>
      </div>
      
      <div className="border-t border-gray-300 pt-3 mt-3">
        <div className="flex justify-between text-base font-semibold text-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      <Link 
        href="/checkout" 
        className="w-full mt-4 rounded-full bg-foreground py-3 px-4 text-sm font-semibold tracking-[0.25em] text-white transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-nocturne-900 text-center block flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure Checkout
      </Link>
      
      <Link 
        href="/" 
        className="w-full mt-2 rounded-full border border-nocturne-200 py-3 px-4 text-sm font-semibold tracking-[0.25em] text-nocturne-700 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-nocturne-400 text-center block"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

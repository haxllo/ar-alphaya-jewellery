'use client'

import Link from 'next/link'
import { usePriceFormatter } from '@/hooks/useCurrency'

interface CartSummaryProps {
  subtotal: number
  shippingEstimate: number
  total: number
  itemCount: number
}

export default function CartSummary({ 
  subtotal, 
  shippingEstimate, 
  total, 
  itemCount 
}: CartSummaryProps) {
  const { formatPrice } = usePriceFormatter()

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between text-xs sm:text-sm text-deep-black/70">
        <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      
      <div className="flex justify-between text-xs sm:text-sm">
        <span className="text-deep-black/70">Delivery (within Sri Lanka)</span>
        <span className="text-green-600 font-medium">
          {shippingEstimate === 0 ? 'Free' : formatPrice(shippingEstimate)}
        </span>
      </div>
      
      <div className="border-t border-metal-gold/20 pt-2 sm:pt-3 mt-2 sm:mt-3">
        <div className="flex justify-between text-sm sm:text-base font-semibold text-deep-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      
      <Link 
        href="/checkout" 
        className="w-full mt-3 sm:mt-4 rounded-full bg-metal-gold py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-soft transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-forest-deep text-center block flex items-center justify-center"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="hidden sm:inline">Secure Checkout</span>
        <span className="sm:hidden">Checkout</span>
      </Link>
      
      <Link 
        href="/" 
        className="w-full mt-2 rounded-full border border-metal-gold/20 py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-deep-black/70 transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-metal-gold text-center block"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

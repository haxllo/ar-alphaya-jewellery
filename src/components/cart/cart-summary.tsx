'use client'

import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  shippingEstimate: number
  taxEstimate: number
  total: number
  itemCount: number
}

export default function CartSummary({ 
  subtotal, 
  shippingEstimate, 
  taxEstimate, 
  total, 
  itemCount 
}: CartSummaryProps) {
  const freeShippingThreshold = 500000

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-black mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>Rs {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center">
            Shipping
            <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>{shippingEstimate === 0 ? 'FREE' : `Rs ${shippingEstimate.toLocaleString()}`}</span>
        </div>
        
        {/* Shipping Notifications */}
        {shippingEstimate === 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            🎉 You qualified for FREE shipping!
          </div>
        )}
        
        {shippingEstimate > 0 && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add Rs {(freeShippingThreshold - subtotal).toLocaleString()} more for FREE shipping
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1">
              {Math.round((subtotal / freeShippingThreshold) * 100)}% towards free shipping
            </div>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center">
            Tax estimate
            <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>Rs {taxEstimate.toLocaleString()}</span>
        </div>
        
        {/* Total */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between text-lg font-semibold text-black">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Including all taxes and fees</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <Link 
          href="/checkout" 
          className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-center block flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </Link>
        <Link 
          href="/" 
          className="w-full border border-gray-300 text-black py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
        >
          Continue Shopping
        </Link>
      </div>
      
      {/* Security & Trust Indicators */}
      <div className="mt-6 space-y-3 text-xs text-gray-500">
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure checkout guaranteed
        </div>
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          30-day return policy
        </div>
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          Authenticity guaranteed
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-3">We accept</p>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">VISA</span>
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">MC</span>
          </div>
          <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">PH</span>
          </div>
        </div>
      </div>
    </div>
  )
}

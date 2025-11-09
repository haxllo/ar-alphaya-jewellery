'use client'

import { useState, useEffect } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'
import SizeGuideModal from '@/components/ui/SizeGuideModal'
import Link from 'next/link'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'payhere' | 'bank_transfer'

function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user
  const isLoading = status === 'loading'
  const error = status === 'unauthenticated' ? new Error('Not authenticated') : null
  
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { formatPrice } = usePriceFormatter()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-700">Loading…</div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full border border-primary-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-primary-800 mb-2">Sign in to continue</h1>
          <p className="text-primary-600 mb-4">You need to be logged in to proceed to checkout.</p>
          <Link
            href="/auth/signin?callbackUrl=/checkout"
            prefetch={false}
            className="inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold tracking-[0.3em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-nocturne-900"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payhere')
  const [isProcessing, setIsProcessing] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || []
      setCustomerInfo(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      }))
    }
  }, [user])
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 1000 // Fixed shipping cost (LKR)
  const total = subtotal + shipping
  
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading checkout...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{String(error)}</p>
        <Link href="/" className="bg-black text-white px-6 py-2 rounded">Go Home</Link>
      </div>
    )
  }
  
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <p className="text-neutral-600 mb-6">Add some items to your cart before checkout.</p>
        <Link href="/" className="bg-black text-white px-6 py-2 rounded">Continue Shopping</Link>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required'
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required'
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required'
    if (!customerInfo.city.trim()) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayHerePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Create payment request
      const response = await fetch('/api/checkout/payhere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items,
          total,
          orderId: `ORDER-${Date.now()}`
        })
      })
      
      const { paymentData } = await response.json()
      
      // Initialize PayHere payment
      if (window.payhere) {
        window.payhere.startPayment(paymentData)
      } else {
        alert('PayHere not loaded. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    if (paymentMethod === 'payhere') {
      try { analytics.beginCheckout(items, total) } catch {}
      await handlePayHerePayment()
    } else if (paymentMethod === 'bank_transfer') {
      alert('Bank transfer instructions will be sent to your email.')
      try { analytics.purchase('bank_transfer_' + Date.now(), items, total) } catch {}
      clear()
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      {/* Progress Indicator */}
      <ol className="flex items-center mb-8 text-sm" aria-label="Progress">
        {['Cart','Information','Payment'].map((step, idx) => (
          <li key={step} className="flex-1 flex items-center">
            <div className={`flex items-center gap-2 ${idx <= 1 ? 'text-black' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx <= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>{idx+1}</span>
              <span className="hidden sm:inline">{step}</span>
            </div>
            {idx < 2 && <div className={`flex-1 h-px mx-2 ${idx < 1 ? 'bg-black' : 'bg-gray-200'}`}></div>}
          </li>
        ))}
      </ol>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Customer Information */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    onBlur={validate}
                    aria-invalid={!!errors.firstName}
                    className={`w-full border rounded px-3 py-2 ${errors.firstName && touched.firstName ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    onBlur={validate}
                    aria-invalid={!!errors.lastName}
                    className={`w-full border rounded px-3 py-2 ${errors.lastName && touched.lastName ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    onBlur={validate}
                    aria-invalid={!!errors.email}
                    className={`w-full border rounded px-3 py-2 ${errors.email && touched.email ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    onBlur={validate}
                    aria-invalid={!!errors.phone}
                    className={`w-full border rounded px-3 py-2 ${errors.phone && touched.phone ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    onBlur={validate}
                    aria-invalid={!!errors.address}
                    className={`w-full border rounded px-3 py-2 ${errors.address && touched.address ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.address && touched.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      onBlur={validate}
                      aria-invalid={!!errors.city}
                      className={`w-full border rounded px-3 py-2 ${errors.city && touched.city ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.city && touched.city && (
                      <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <span>PayHere (Credit/Debit Cards, Online Banking)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white py-3 px-6 rounded hover:bg-neutral-800 disabled:bg-neutral-400"
            >
              {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-neutral-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.size && <div className="text-neutral-500">Size: {item.size}</div>}
                    <div className="text-neutral-500">Qty: {item.quantity}</div>
                  </div>
                  <div>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            {/* Size Guide Link */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Need help with sizing? View Size Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PayHere Script */}
      <script src="https://www.payhere.lk/lib/payhere.js" async />
      
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </div>
  )
}

export default CheckoutPage

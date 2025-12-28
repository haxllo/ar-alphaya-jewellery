'use client'

import { useState, useEffect } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'
import SizeGuideModal from '@/components/ui/SizeGuideModal'
import Link from 'next/link'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import CheckoutContainer from '@/components/checkout/CheckoutContainer'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import BillingInfoCard from '@/components/checkout/BillingInfoCard'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector'
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard'
import MobileOrderSummary from '@/components/checkout/MobileOrderSummary'
import MobileCheckoutFooter from '@/components/checkout/MobileCheckoutFooter'
import { Button } from '@/components/ui/button'
import type { PaymentMethod } from '@/components/checkout/checkout-types'

function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user
  const isLoading = status === 'loading'
  // Guest checkout allowed, so unauthenticated is not an error
  const error = null
  
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { formatPrice } = usePriceFormatter()
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer')
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
  
  // Free delivery within Sri Lanka for orders above Rs.5,000
  const freeShippingThreshold = 5000
  const shipping = subtotal >= freeShippingThreshold ? 0 : 1000
  
  // No discount applied at checkout (apply promo codes in cart)
  const discount = 0
  
  const total = subtotal - discount + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-700">Loading…</div>
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

  const handleBankTransferPayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/checkout/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items,
          total,
          orderId: `ORDER-${Date.now()}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to place order')
      }

      try { analytics.purchase('bank_transfer_' + Date.now(), items, total) } catch {}
      clear() // Clear cart
      router.push('/checkout/success?payment_method=bank_transfer')
    } catch (error) {
      console.error('Bank transfer error:', error)
      alert('Failed to place order. Please try again.')
      setIsProcessing(false)
    }
  }

  const handlePayzyPayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/checkout/payzy/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
             ...customerInfo,
             country: 'Sri Lanka', // Defaulting country
          },
          items,
          total,
          orderId: `ORDER-${Date.now()}`
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || 'Failed to initiate Payzy payment')
      }

      // Clear cart before redirecting? 
      // Usually better to clear AFTER success to avoid data loss if they go back.
      // But we can clear it here if we assume the order is created.
      // However, if they hit back, cart is empty.
      // Better: Don't clear here. Clear in success page or verify route.
      // But Checkout page state relies on cart. 
      // Let's keep cart for now.
      
      window.location.href = data.url
    } catch (error: any) {
      console.error('Payzy error:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    if (paymentMethod === 'bank_transfer') {
      await handleBankTransferPayment()
    } else if (paymentMethod === 'payzy') {
      await handlePayzyPayment()
    }
  }

  return (
    <CheckoutContainer>
      <CheckoutProgress currentStep={2} />
      
      {/* Mobile Order Summary - Collapsible */}
      <MobileOrderSummary
        items={items}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        total={total}
        formatPrice={formatPrice}
      />
      
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Form Sections */}
        <div className="space-y-6 pb-24 lg:pb-0">
          
          {!user && (
            <div className="mb-6 rounded-lg border border-metal-gold/20 bg-neutral-soft p-4 sm:p-6 text-center">
              <h2 className="text-lg font-semibold text-deep-black mb-2">Have an account?</h2>
              <p className="text-deep-black/60 mb-4 text-sm">
                Sign in for a faster checkout experience, or continue as a guest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth/signin?callbackUrl=/checkout"
                  className="inline-flex items-center justify-center rounded-full bg-deep-black px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-forest-deep"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup?callbackUrl=/checkout"
                   className="inline-flex items-center justify-center rounded-full border border-deep-black px-6 py-2 text-sm font-semibold text-deep-black transition-all hover:bg-deep-black hover:text-white"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          <BillingInfoCard
            customerInfo={customerInfo}
            errors={errors}
            touched={touched}
            onChange={handleInputChange}
            onBlur={validate}
          />

          <PaymentMethodSelector
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />

          {/* Desktop Place Order Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isProcessing}
            onClick={handleSubmit}
            className="hidden w-full lg:flex bg-deep-black hover:bg-forest-deep text-white font-semibold text-base h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete Order
              </>
            )}
          </Button>
        </div>

        {/* Right Column: Order Summary (Sticky) - Desktop Only */}
        <div className="hidden lg:sticky lg:top-24 lg:h-fit lg:block">
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            formatPrice={formatPrice}
          />
        </div>
      </div>
      
      {/* Mobile Sticky Footer with Place Order Button */}
      <MobileCheckoutFooter
        total={total}
        formatPrice={formatPrice}
        isProcessing={isProcessing}
        onSubmit={handleSubmit}
      />

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </CheckoutContainer>
  )
}

export default CheckoutPage
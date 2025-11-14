'use client'

import { useState, useEffect } from 'react'
import { usePriceFormatter } from '@/hooks/useCurrency'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'
import SizeGuideModal from '@/components/ui/SizeGuideModal'
import Link from 'next/link'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import PayHereCheckout from '@/components/checkout/PayHereCheckout'
import CheckoutContainer from '@/components/checkout/CheckoutContainer'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import BillingInfoCard from '@/components/checkout/BillingInfoCard'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector'
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard'
import MobileOrderSummary from '@/components/checkout/MobileOrderSummary'
import MobileCheckoutFooter from '@/components/checkout/MobileCheckoutFooter'
import { Button } from '@/components/ui/button'
import type { PayHerePayment } from '@/types/payhere'
import type { PaymentMethod } from '@/components/checkout/checkout-types'

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
  const [paymentData, setPaymentData] = useState<PayHerePayment | null>(null)
  
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
      
      if (!response.ok) {
        throw new Error('Failed to create payment')
      }
      
      const { paymentData: payment } = await response.json()
      
      // Set payment data - PayHereCheckout component will handle the rest
      setPaymentData(payment)
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
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
    <CheckoutContainer>
      <CheckoutProgress currentStep={2} />
      
      {/* Mobile Order Summary - Collapsible */}
      <MobileOrderSummary
        items={items}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        formatPrice={formatPrice}
      />
      
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Form Sections */}
        <div className="space-y-6 pb-24 lg:pb-0">
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
            className="hidden w-full lg:flex"
          >
            {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
          </Button>
        </div>

        {/* Right Column: Order Summary (Sticky) - Desktop Only */}
        <div className="hidden lg:sticky lg:top-24 lg:h-fit lg:block">
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
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

      {/* PayHere Checkout Component - Hidden until payment initiated */}
      <PayHereCheckout
        paymentData={paymentData}
        onSuccess={(orderId) => {
          console.log('Payment successful:', orderId)
          clear() // Clear cart on success
        }}
        onCancel={() => {
          setIsProcessing(false)
          setPaymentData(null)
        }}
        onError={(error) => {
          console.error('Payment error:', error)
          setIsProcessing(false)
          setPaymentData(null)
        }}
      />

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </CheckoutContainer>
  )
}

export default CheckoutPage
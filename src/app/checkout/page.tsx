'use client'

import { useState, useEffect, useRef } from 'react'
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
import type { PaymentMethod, BillingInfo } from '@/components/checkout/checkout-types'

function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user
  const isLoading = status === 'loading'
  const error = null
  
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { formatPrice } = usePriceFormatter()
  
  // Multi-step checkout: 2 = Information, 3 = Payment
  const [currentStep, setCurrentStep] = useState(2)

  // Generate a stable Order ID for the session to prevent PayPal button re-renders
  const orderIdRef = useRef<string>('')
  useEffect(() => {
    if (!orderIdRef.current) {
      orderIdRef.current = `ORDER-${Date.now()}`
    }
  }, [])
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  // Billing Address State
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true)
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  
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
  const freeShippingThreshold = 5000
  const shipping = subtotal >= freeShippingThreshold ? 0 : 1000
  const discount = 0
  const total = subtotal - discount + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-700">Loading…</div>
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

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required'
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required'
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required'
    if (!customerInfo.city.trim()) newErrors.city = 'City is required'
    
    // Validate Billing if not same as delivery
    if (!billingSameAsDelivery) {
       // Ideally add validation for billing fields too
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper to get effective billing address
  const getEffectiveCustomerInfo = () => {
    if (billingSameAsDelivery) {
      return customerInfo
    }
    return {
      ...customerInfo,
      firstName: billingInfo.firstName || customerInfo.firstName,
      lastName: billingInfo.lastName || customerInfo.lastName,
      address: billingInfo.address || customerInfo.address,
      city: billingInfo.city || customerInfo.city,
      postalCode: billingInfo.postalCode || customerInfo.postalCode,
    }
  }

  const handleBankTransferPayment = async () => {
    if (!validate()) {
      alert('Please fill in all required fields before completing your order.')
      return
    }
    
    setIsProcessing(true)
    const effectiveCustomer = getEffectiveCustomerInfo()
    const currentOrderId = orderIdRef.current || `ORDER-${Date.now()}`

    try {
      const response = await fetch('/api/checkout/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: effectiveCustomer,
          items,
          total,
          orderId: currentOrderId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to place order')
      }

      try { analytics.purchase('bank_transfer_' + Date.now(), items, total) } catch {}
      clear()
      router.push('/checkout/success?payment_method=bank_transfer')
    } catch (error: any) {
      console.error('Bank transfer error:', error)
      alert(error.message || 'Failed to place order. Please try again.')
      setIsProcessing(false)
    }
  }

  const handlePayzyPayment = async () => {
    if (!validate()) {
      alert('Please fill in all required fields before completing your order.')
      return
    }
    
    setIsProcessing(true)
    const effectiveCustomer = getEffectiveCustomerInfo()
    const currentOrderId = orderIdRef.current || `ORDER-${Date.now()}`

    try {
      const response = await fetch('/api/checkout/payzy/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { ...effectiveCustomer, country: 'Sri Lanka' },
          items,
          total,
          orderId: currentOrderId
        })
      })

      const data = await response.json()
      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || 'Failed to initiate Payzy payment')
      }
      window.location.href = data.url
    } catch (error: any) {
      console.error('Payzy error:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleCardSuccess = () => {
    try { analytics.purchase('card_' + Date.now(), items, total) } catch {}
    clear()
    router.push('/checkout/success?payment_method=card')
  }

  const handleCardError = (err: string) => {
    alert(err)
    setIsProcessing(false)
  }
  
  const handleCardBeforeCreate = () => {
    // Validate before allowing card order creation
    if (!validate()) {
      alert('Please fill in all required fields before continuing with card payment.')
      return false
    }
    setIsProcessing(true)
    return true
  }

  const handlePayPalSuccess = () => {
    try { analytics.purchase('paypal_' + Date.now(), items, total) } catch {}
    clear()
    router.push('/checkout/success?payment_method=paypal')
  }

  const handlePayPalError = (err: string) => {
    alert(err)
    setIsProcessing(false)
  }
  
  const handlePayPalBeforeCreate = () => {
    // Validate before allowing PayPal order creation
    if (!validate()) {
      alert('Please fill in all required fields before continuing with PayPal.')
      return false
    }
    setIsProcessing(true)
    return true
  }

  // Continue from Information to Payment step
  const handleContinueToPayment = () => {
    if (!validate()) {
      // Mark all fields as touched to show errors
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true
      })
      return
    }
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Go back to Information step
  const handleBackToInformation = () => {
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    if (paymentMethod === 'bank_transfer') {
      await handleBankTransferPayment()
    } else if (paymentMethod === 'payzy') {
      await handlePayzyPayment()
    }
    // Note: 'card' and 'paypal' are handled by their respective components
  }

  return (
    <CheckoutContainer>
      <CheckoutProgress currentStep={currentStep} />
      
      <MobileOrderSummary
        items={items}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        total={total}
        formatPrice={formatPrice}
      />
      
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
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

          {/* Step 2: Information */}
          {currentStep === 2 && (
            <>
              <BillingInfoCard
                customerInfo={customerInfo}
                errors={errors}
                touched={touched}
                onChange={handleInputChange}
                onBlur={validate}
              />
              
              {/* Continue to Payment Button */}
              <Button
                type="button"
                size="lg"
                onClick={handleContinueToPayment}
                className="w-full bg-deep-black hover:bg-forest-deep text-white font-semibold text-base h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Continue to Payment
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <>
              {/* Back to Information Link */}
              <button
                type="button"
                onClick={handleBackToInformation}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-4"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Information
              </button>
              
              {/* Customer Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-900">Shipping to</h3>
                  <button
                    type="button"
                    onClick={handleBackToInformation}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {customerInfo.firstName} {customerInfo.lastName}<br />
                  {customerInfo.address}<br />
                  {customerInfo.city}{customerInfo.postalCode ? `, ${customerInfo.postalCode}` : ''}<br />
                  {customerInfo.email} • {customerInfo.phone}
                </p>
              </div>

              <PaymentMethodSelector
                selected={paymentMethod}
                onChange={setPaymentMethod}
                billingSameAsDelivery={billingSameAsDelivery}
                setBillingSameAsDelivery={setBillingSameAsDelivery}
                billingInfo={billingInfo}
                onBillingChange={handleBillingChange}
                // PayPal Props
                payPalAmount={total}
                payPalOrderId={orderIdRef.current || `ORDER-${Date.now()}`}
                onPayPalSuccess={handlePayPalSuccess}
                onPayPalError={handlePayPalError}
                onPayPalBeforeCreate={handlePayPalBeforeCreate}
                // Card Props
                cardAmount={total}
                cardOrderId={orderIdRef.current || `ORDER-${Date.now()}`}
                onCardSuccess={handleCardSuccess}
                onCardError={handleCardError}
                onCardBeforeCreate={handleCardBeforeCreate}
              />

              {paymentMethod !== 'paypal' && paymentMethod !== 'card' && (
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleSubmit}
                  className="w-full bg-deep-black hover:bg-forest-deep text-white font-semibold text-base h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
              )}
            </>
          )}
        </div>

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
      
      <MobileCheckoutFooter
        total={total}
        formatPrice={formatPrice}
        isProcessing={isProcessing}
        onSubmit={handleSubmit}
        currentStep={currentStep}
        onContinueToPayment={handleContinueToPayment}
        paymentMethod={paymentMethod}
      />

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </CheckoutContainer>
  )
}

export default CheckoutPage

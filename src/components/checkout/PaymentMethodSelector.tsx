'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CreditCard, Building2, Check, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import type { PaymentMethod, BillingInfo } from './checkout-types'
import { cn } from '@/lib/utils'
import PayPalButton from './PayPalButton'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
  billingSameAsDelivery: boolean
  setBillingSameAsDelivery: (value: boolean) => void
  billingInfo: BillingInfo
  onBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  // PayPal Props
  payPalAmount: number
  payPalOrderId: string
  onPayPalSuccess: () => void
  onPayPalError: (err: string) => void
  onPayPalBeforeCreate?: () => boolean
  // Card Props (now Braintree)
  cardAmount: number
  cardOrderId: string
  onCardSuccess: () => void
  onCardError: (err: string) => void
  onCardBeforeCreate?: () => boolean
}

const paymentMethods = [
  {
    id: 'card' as PaymentMethod,
    label: 'Credit / Debit Card',
    description: 'Instant payment',
    icon: CreditCard,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    badge: { text: 'Fastest', color: 'bg-green-500' }
  },
  {
    id: 'paypal' as PaymentMethod,
    label: 'PayPal',
    description: 'Pay with PayPal account',
    icon: null, // Use logo instead
    logo: '/payment-logos/960px-PayPal_Logo2014.svg.png',
    iconColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-600',
    badge: { text: 'Popular', color: 'bg-blue-500' }
  },
  {
    id: 'payzy' as PaymentMethod,
    label: 'Payzy (BNPL)',
    description: 'Pay in installments',
    icon: null,
    logo: '/payment-logos/payzy.png',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    badge: null
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer',
    description: 'Direct bank payment',
    icon: Building2,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    badge: { text: 'No Fees', color: 'bg-emerald-500' }
  }
]

export default function PaymentMethodSelector({
  selected,
  onChange,
  billingSameAsDelivery,
  setBillingSameAsDelivery,
  billingInfo,
  onBillingChange,
  payPalAmount,
  payPalOrderId,
  onPayPalSuccess,
  onPayPalError,
  onPayPalBeforeCreate,
  cardAmount,
  cardOrderId,
  onCardSuccess,
  onCardError,
  onCardBeforeCreate
}: PaymentMethodSelectorProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-sm">
            <span className="font-bold text-lg">2. PAYMENT</span>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-4 space-y-8">
          
          {/* METHOD SELECTION HEADER */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
              <Check className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm uppercase tracking-tight">Choose your payment method</span>
          </div>

          {/* PAYMENT METHOD CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentMethods.map((method) => {
              const isSelected = selected === method.id
              const Icon = method.icon
              
              return (
                <div
                  key={method.id}
                  onClick={() => onChange(method.id)}
                  className={cn(
                    "relative flex flex-col border-2 rounded-xl p-4 cursor-pointer transition-all duration-200",
                    "hover:shadow-md hover:scale-[1.02]",
                    isSelected 
                      ? `${method.borderColor} ${method.bgColor} shadow-md` 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  {/* Badge */}
                  {method.badge && (
                    <span className={cn(
                      "absolute -top-2 -right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full",
                      method.badge.color
                    )}>
                      {method.badge.text}
                    </span>
                  )}

                  {/* Radio Indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                      isSelected ? "border-black bg-black" : "border-gray-300"
                    )}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    
                    {/* Icon or Logo */}
                    {method.logo ? (
                      <Image 
                        src={method.logo} 
                        alt={method.label} 
                        width={60} 
                        height={20} 
                        className="opacity-90"
                      />
                    ) : Icon && (
                      <Icon className={cn("h-6 w-6", method.iconColor)} />
                    )}
                  </div>

                  {/* Label and Description */}
                  <div className="mt-auto">
                    <p className="font-semibold text-sm text-gray-900">{method.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* DYNAMIC CONTENT PER METHOD */}
          <div className="mt-6">
            {/* Card Payment (Braintree) */}
            {selected === 'card' && (
              <div className="p-6 border border-amber-200 rounded-xl bg-gradient-to-b from-amber-50 to-white animate-in slide-in-from-top-2 duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                    <CreditCard className="h-8 w-8 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Card Payment Temporarily Unavailable</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    We're currently setting up our payment system for production. 
                    Card payments will be available soon.
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-amber-100">
                    <p className="text-sm text-gray-700 font-medium mb-2">Available payment methods:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        PayPal (Instant)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Bank Transfer
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Payzy (Buy Now, Pay Later)
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Please check back soon or use an alternative payment method.
                  </p>
                </div>
              </div>
            )}

            {/* PayPal */}
            {selected === 'paypal' && (
              <div className="p-6 border border-blue-200 rounded-xl bg-gradient-to-b from-blue-50 to-white animate-in slide-in-from-top-2 duration-300">
                <div className="text-center mb-4">
                  <Image 
                    src="/payment-logos/960px-PayPal_Logo2014.svg.png" 
                    alt="PayPal" 
                    width={120} 
                    height={32} 
                    className="mx-auto mb-3"
                  />
                  <p className="text-sm text-gray-600">
                    You will be redirected to PayPal to complete your purchase securely.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Don't have an account? You can still pay with your card through PayPal.
                  </p>
                </div>
                <div className="max-w-[300px] mx-auto">
                  <PayPalButton 
                    amount={payPalAmount}
                    orderId={payPalOrderId}
                    onSuccess={onPayPalSuccess}
                    onError={onPayPalError}
                    onBeforeCreate={onPayPalBeforeCreate}
                    termsAccepted={termsAccepted}
                  />
                </div>
              </div>
            )}

            {/* Payzy */}
            {selected === 'payzy' && (
              <div className="p-6 border border-purple-200 rounded-xl bg-gradient-to-b from-purple-50 to-white animate-in slide-in-from-top-2 duration-300">
                <div className="text-center mb-4">
                  <Image 
                    src="/payment-logos/payzy.png" 
                    alt="Payzy" 
                    width={100} 
                    height={30} 
                    className="mx-auto mb-2"
                  />
                  <h4 className="font-semibold text-gray-900">Buy Now, Pay Later</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Split your payment into easy installments with Payzy. 
                    You will be redirected to complete the payment.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Don't have an account? Sign up during checkout.
                  </p>
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-purple-500" />
                    No interest
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-purple-500" />
                    Quick approval
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {selected === 'bank_transfer' && (
              <div className="p-6 border border-emerald-200 rounded-xl bg-gradient-to-b from-emerald-50 to-white animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Direct Bank Transfer</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Make a bank transfer directly to our account. 
                      Your order will be processed after payment confirmation.
                    </p>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-100">
                      <p className="text-xs text-gray-500 mb-2">Bank Details:</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-500">Bank:</span> <span className="font-medium">Commercial Bank</span></p>
                        <p><span className="text-gray-500">Account:</span> <span className="font-medium">1234567890</span></p>
                        <p><span className="text-gray-500">Name:</span> <span className="font-medium">AR Alphaya Jewellery</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BILLING ADDRESS TOGGLE */}
          <div className="pt-6 border-t space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-tighter">Billing Address</h3>
            
            <div className="space-y-3">
              <div 
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors" 
                onClick={() => setBillingSameAsDelivery(true)}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                  billingSameAsDelivery ? "border-black bg-black" : "border-gray-300"
                )}>
                  {billingSameAsDelivery && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium">Same as delivery address</span>
              </div>

              <div 
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors" 
                onClick={() => setBillingSameAsDelivery(false)}
              >
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                  !billingSameAsDelivery ? "border-black bg-black" : "border-gray-300"
                )}>
                  {!billingSameAsDelivery && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium">Use a different billing address</span>
              </div>
            </div>

            {!billingSameAsDelivery && (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="First Name*" 
                    name="firstName"
                    value={billingInfo.firstName}
                    onChange={onBillingChange}
                    className="h-11"
                  />
                  <Input 
                    placeholder="Last Name*" 
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={onBillingChange}
                    className="h-11"
                  />
                </div>
                <Input 
                  placeholder="Address*" 
                  name="address"
                  value={billingInfo.address}
                  onChange={onBillingChange}
                  className="h-11"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="City*" 
                    name="city"
                    value={billingInfo.city}
                    onChange={onBillingChange}
                    className="h-11"
                  />
                  <Input 
                    placeholder="Postal Code*" 
                    name="postalCode"
                    value={billingInfo.postalCode}
                    onChange={onBillingChange}
                    className="h-11"
                  />
                </div>
              </div>
            )}
          </div>

          {/* POLICIES */}
          <div className="pt-6 border-t space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input 
                type="checkbox" 
                id="newsletter"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" 
              />
              <label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">
                Join our community for the latest trends and exclusive offers.
              </label>
            </div>
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-colors",
              !termsAccepted ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"
            )}>
              <input 
                type="checkbox" 
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black" 
                required 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                <span className="text-red-500">*</span> I am 18+ years old, and agree to AR ALPHAYA's{' '}
                <a href="/terms" className="text-black underline hover:no-underline">Terms & Conditions</a> and{' '}
                <a href="/privacy" className="text-black underline hover:no-underline">Privacy Policy</a>.
              </label>
            </div>
            {!termsAccepted && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <span>⚠️</span> Please accept the Terms & Conditions to proceed with payment
              </p>
            )}
          </div>

          {/* Security Footer */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

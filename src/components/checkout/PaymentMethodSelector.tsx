'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CreditCard, Building2, Check, Info } from 'lucide-react'
import Image from 'next/image'
import type { PaymentMethod } from './checkout-types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true)

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

          {/* HORIZONTAL BOXES */}
          <RadioGroup
            value={selected}
            onValueChange={(value) => onChange(value as PaymentMethod)}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            {/* CARD */}
            <div className={cn(
              "relative flex items-center justify-between border-2 rounded-md p-3 cursor-pointer transition-all",
              selected === 'card' ? "border-black bg-white" : "border-gray-200 bg-gray-50/30"
            )} onClick={() => onChange('card')}>
              <div className="flex items-center gap-3">
                 <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selected === 'card' ? "border-black" : "border-gray-300"
                 )}>
                    {selected === 'card' && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                 </div>
                 <span className="text-sm font-semibold">Credit Card/ Debit Card</span>
              </div>
            </div>

            {/* PAYPAL */}
            <div className={cn(
              "relative flex items-center justify-between border-2 rounded-md p-3 cursor-pointer transition-all",
              selected === 'paypal' ? "border-black bg-white" : "border-gray-200 bg-gray-50/30"
            )} onClick={() => onChange('paypal')}>
              <div className="flex items-center gap-3">
                 <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selected === 'paypal' ? "border-black" : "border-gray-300"
                 )}>
                    {selected === 'paypal' && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                 </div>
                 <span className="text-sm font-semibold">PayPal</span>
              </div>
              <Image src="/payment-logos/paypal.svg" alt="PayPal" width={40} height={12} className="opacity-80" />
            </div>

            {/* PAYZY */}
            <div className={cn(
              "relative flex items-center justify-between border-2 rounded-md p-3 cursor-pointer transition-all",
              selected === 'payzy' ? "border-black bg-white" : "border-gray-200 bg-gray-50/30"
            )} onClick={() => onChange('payzy')}>
              <div className="flex items-center gap-3">
                 <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selected === 'payzy' ? "border-black" : "border-gray-300"
                 )}>
                    {selected === 'payzy' && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                 </div>
                 <span className="text-sm font-semibold">Payzy (BNPL)</span>
              </div>
            </div>

            {/* BANK TRANSFER */}
            <div className={cn(
              "relative flex items-center justify-between border-2 rounded-md p-3 cursor-pointer transition-all",
              selected === 'bank_transfer' ? "border-black bg-white" : "border-gray-200 bg-gray-50/30"
            )} onClick={() => onChange('bank_transfer')}>
              <div className="flex items-center gap-3">
                 <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selected === 'bank_transfer' ? "border-black" : "border-gray-300"
                 )}>
                    {selected === 'bank_transfer' && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                 </div>
                 <span className="text-sm font-semibold">Bank Transfer</span>
              </div>
            </div>
          </RadioGroup>

          {/* DYNAMIC CONTENT PER METHOD */}
          {selected === 'card' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div>
                  <h3 className="font-bold text-sm uppercase tracking-tighter mb-4">Credit Card/ Debit Card Details</h3>
                  <div className="flex items-center gap-3 mb-6">
                     <span className="text-xs text-gray-500">We accept:</span>
                     <div className="flex gap-2">
                        <div className="h-6 w-10 bg-gray-100 rounded border flex items-center justify-center">
                           <Image src="/payment-logos/mastercard.svg" alt="Mastercard" width={20} height={12} />
                        </div>
                        <div className="h-6 w-10 bg-gray-100 rounded border flex items-center justify-center">
                           <Image src="/payment-logos/visa.svg" alt="Visa" width={24} height={12} />
                        </div>
                        <div className="h-6 w-10 bg-gray-100 rounded border flex items-center justify-center">
                           <Image src="/payment-logos/amex.svg" alt="Amex" width={18} height={12} />
                        </div>
                     </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-4">* These fields are required.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input placeholder="Card Number*" className="h-12" />
                     <Input placeholder="Name on Card*" className="h-12" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                     <div className="flex gap-2">
                        <select className="flex-1 h-12 border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                           <option>MM</option>
                           {Array.from({length: 12}).map((_, i) => (
                             <option key={i}>{(i+1).toString().padStart(2, '0')}</option>
                           ))}
                        </select>
                        <select className="flex-1 h-12 border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                           <option>YY</option>
                           {Array.from({length: 10}).map((_, i) => (
                             <option key={i}>{new Date().getFullYear() + i}</option>
                           ))}
                        </select>
                     </div>
                     <div className="relative">
                        <Input placeholder="CVV*" className="h-12 pr-10" maxLength={4} />
                        <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 cursor-help" />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {selected === 'paypal' && (
            <div className="p-6 border border-dashed rounded-md bg-blue-50/30 text-center animate-in fade-in duration-300">
               <p className="text-sm text-blue-800 mb-4">
                 You will be redirected to PayPal to complete your purchase securely.
               </p>
               {/* PayPal SDK Button Placeholder */}
               <div className="max-w-[300px] mx-auto h-[45px] bg-yellow-400 rounded-md flex items-center justify-center font-bold text-[#003087]">
                 PayPal
               </div>
            </div>
          )}

          {selected === 'payzy' && (
            <div className="p-6 border border-dashed rounded-md bg-purple-50/30 animate-in fade-in duration-300">
               <p className="text-sm text-purple-800">
                 Pay in easy installments with Payzy. You will be redirected to the Payzy portal.
               </p>
            </div>
          )}

          {/* BILLING ADDRESS TOGGLE */}
          <div className="pt-8 border-t space-y-4">
             <h3 className="font-bold text-sm uppercase tracking-tighter">Billing Address</h3>
             
             <div className="space-y-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setBillingSameAsDelivery(true)}>
                   <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      billingSameAsDelivery ? "border-black" : "border-gray-300"
                   )}>
                      {billingSameAsDelivery && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                   </div>
                   <span className="text-sm font-medium">Billing address is the same as delivery address</span>
                </div>

                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setBillingSameAsDelivery(false)}>
                   <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      !billingSameAsDelivery ? "border-black" : "border-gray-300"
                   )}>
                      {!billingSameAsDelivery && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                   </div>
                   <span className="text-sm font-medium">Add a new billing address</span>
                </div>
             </div>

             {!billingSameAsDelivery && (
               <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="First Name*" />
                     <Input placeholder="Last Name*" />
                  </div>
                  <Input placeholder="Address*" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="City*" />
                     <Input placeholder="Postal Code*" />
                  </div>
               </div>
             )}
          </div>

          {/* POLICIES */}
          <div className="pt-8 border-t space-y-4 text-xs text-gray-500">
             <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                <label>Join our community for the latest trends and exclusive offers.</label>
             </div>
             <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5 rounded border-gray-300" required />
                <label>I am 18+ years old, and agree to AR ALPHAYA's <a href="/terms" className="underline">Terms & Conditions</a> and <a href="/privacy" className="underline">Privacy Policy</a>.</label>
             </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
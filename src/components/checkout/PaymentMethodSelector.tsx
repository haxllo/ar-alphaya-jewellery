'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Building2, Check } from 'lucide-react'
import Image from 'next/image'
import type { PaymentMethod } from './checkout-types'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={(value) => onChange(value as PaymentMethod)}
          className="space-y-3"
        >
          {/* Bank Transfer Option */}
          <RadioGroupItem value="bank_transfer">
            <div className="flex w-full items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {/* Checkmark for selected */}
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black">
                    {selected === 'bank_transfer' && (
                      <div className="h-3 w-3 rounded-full bg-black" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">Bank Transfer</span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">
                      Direct bank transfer • Manual confirmation required
                    </p>
                    
                    <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
                      <strong>Note:</strong> Instructions will be sent to your email
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroupItem>
        </RadioGroup>

        {/* Trust Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Secure & encrypted payment</span>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { ShoppingCart, User, CreditCard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutProgressProps {
  currentStep: number
}

const steps = [
  { id: 1, label: 'Cart', icon: ShoppingCart },
  { id: 2, label: 'Information', icon: User },
  { id: 3, label: 'Payment', icon: CreditCard },
]

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const Icon = step.icon

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Step Icon/Number */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                    isCompleted &&
                      "bg-black text-white",
                    isCurrent &&
                      "bg-black text-white ring-4 ring-black/10",
                    !isCompleted && !isCurrent &&
                      "bg-gray-200 text-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Step Label */}
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      (isCompleted || isCurrent) ? "text-black" : "text-gray-500"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      "h-[2px] w-full transition-all duration-300",
                      isCompleted ? "bg-black" : "bg-gray-200"
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile: Show only active step label */}
      <div className="mt-3 text-center sm:hidden">
        <p className="text-sm font-medium text-black">
          {steps.find((s) => s.id === currentStep)?.label}
        </p>
      </div>
    </nav>
  )
}

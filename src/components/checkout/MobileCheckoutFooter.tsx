'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileCheckoutFooterProps {
  total: number
  formatPrice: (price: number) => string
  isProcessing: boolean
  onSubmit: (e: React.FormEvent) => void
  currentStep?: number
  onContinueToPayment?: () => void
  paymentMethod?: string
}

export default function MobileCheckoutFooter({
  total,
  formatPrice,
  isProcessing,
  onSubmit,
  currentStep = 3,
  onContinueToPayment,
  paymentMethod = 'card',
}: MobileCheckoutFooterProps) {
  // Don't show the footer for PayPal or Card payments (they have their own buttons)
  const hideForPaymentMethods = currentStep === 3 && (paymentMethod === 'paypal' || paymentMethod === 'card')
  
  if (hideForPaymentMethods) {
    return null
  }
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
        "border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
        "safe-area-inset-bottom"
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Price Display */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">Total</span>
            <span className="text-lg font-bold tabular-nums">
              {formatPrice(total)}
            </span>
          </div>

          {/* Step 2: Continue to Payment | Step 3: Place Order */}
          {currentStep === 2 ? (
            <Button
              type="button"
              size="lg"
              onClick={onContinueToPayment}
              className="flex-1 h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                Continue to Payment
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              disabled={isProcessing}
              onClick={(e) => onSubmit(e)}
              className="flex-1 h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Complete Order
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

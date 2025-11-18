'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializePayment, loadPayHereSDK } from '@/lib/checkout/payhere-sdk'
import type { PayHerePayment } from '@/types/payhere'

interface PayHereCheckoutProps {
  paymentData: PayHerePayment | null
  onSuccess?: (orderId: string) => void
  onCancel?: () => void
  onError?: (error: string) => void
}

export default function PayHereCheckout({
  paymentData,
  onSuccess,
  onCancel,
  onError,
}: PayHereCheckoutProps) {
  const router = useRouter()
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load PayHere SDK on mount
  useEffect(() => {
    loadPayHereSDK()
      .then(() => {
        setIsSDKLoaded(true)
      })
      .catch((error) => {
        console.error('Failed to load PayHere SDK:', error)
        onError?.(error.message)
      })
  }, [onError])

  // Initialize payment when data is available
  useEffect(() => {
    if (!paymentData || !isSDKLoaded || isInitializing) return

    setIsInitializing(true)

    const callbacks = {
      onCompleted: (orderId: string) => {
        console.log('Payment completed:', orderId)
        setShowSuccess(true)
        onSuccess?.(orderId)
        
        // Show success animation for 1.5 seconds before redirect
        setTimeout(() => {
          router.push(`/checkout/success?order_id=${orderId}`)
        }, 1500)
      },
      onDismissed: () => {
        console.log('Payment dismissed')
        setIsInitializing(false)
        onCancel?.()
      },
      onError: (error: string) => {
        console.error('PayHere error:', error)
        setIsInitializing(false)
        onError?.(error)
      },
    }

    initializePayment(paymentData, callbacks)
      .catch((error) => {
        console.error('Failed to initialize payment:', error)
        setIsInitializing(false)
        onError?.(error.message)
        alert('Failed to initialize payment. Please try again.')
      })
  }, [paymentData, isSDKLoaded, isInitializing, router, onSuccess, onCancel, onError])

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-3 text-sm text-gray-600">Loading payment gateway...</span>
      </div>
    )
  }

  // Success animation overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 text-sm">Redirecting to confirmation...</p>
        </div>
      </div>
    )
  }

  return null // PayHere SDK handles the UI with custom modal wrapper
}

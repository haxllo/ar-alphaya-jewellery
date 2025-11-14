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
        onSuccess?.(orderId)
        // Redirect to success page
        router.push(`/checkout/success?order_id=${orderId}`)
      },
      onDismissed: () => {
        console.log('Payment dismissed')
        setIsInitializing(false)
        onCancel?.()
      },
      onError: (error: string) => {
        console.error('Payment error:', error)
        setIsInitializing(false)
        onError?.(error)
        // Show error to user
        alert(`Payment failed: ${error}. Please try again.`)
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

  return null // PayHere SDK handles the UI
}

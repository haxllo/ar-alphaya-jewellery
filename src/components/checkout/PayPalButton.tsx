'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface PayPalButtonProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
  onBeforeCreate?: () => boolean // Called before creating order, return false to cancel
  termsAccepted?: boolean
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({ amount, orderId, onSuccess, onError, onBeforeCreate, termsAccepted = false }: PayPalButtonProps) {
  const [loaded, setLoaded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const termsAcceptedRef = useRef(termsAccepted)
  
  // Keep ref in sync with prop
  useEffect(() => {
    termsAcceptedRef.current = termsAccepted
  }, [termsAccepted])

  useEffect(() => {
    if (loaded && window.paypal && buttonRef.current && !processing) {
      // Clear previous button if any
      buttonRef.current.innerHTML = ''
      
      window.paypal.Buttons({
        // Styling options (PayPal recommended)
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45,
          tagline: false
        },
        
        createOrder: async () => {
          // Check T&C first (use ref to get latest value)
          if (!termsAcceptedRef.current) {
            console.log('[PayPal] Order creation cancelled - terms not accepted')
            onError('Please accept the Terms & Conditions to proceed.')
            return Promise.reject('Terms not accepted')
          }
          
          // Validate before creating order
          if (onBeforeCreate && !onBeforeCreate()) {
            console.log('[PayPal] Order creation cancelled by validation')
            return Promise.reject('Validation failed')
          }
          
          setProcessing(true)
          try {
            const response = await fetch('/api/checkout/paypal/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, orderId })
            })
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))
              throw new Error(errorData.error || 'Failed to create order')
            }
            
            const order = await response.json()
            console.log('[PayPal] Order created:', order.id)
            return order.id
          } catch (err: any) {
            console.error('[PayPal] Create Order Error:', err)
            setProcessing(false)
            onError(err.message || 'Failed to initiate PayPal transaction')
            throw err
          }
        },
        
        onApprove: async (data: any) => {
          console.log('[PayPal] Payment approved, capturing...', data.orderID)
          try {
            const response = await fetch('/api/checkout/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                orderID: data.orderID,
                localOrderID: orderId
              })
            })
            
            const result = await response.json()
            
            if (result.success) {
              console.log('[PayPal] Payment captured successfully:', result.captureId)
              onSuccess()
            } else {
              console.error('[PayPal] Capture failed:', result.error)
              onError(result.error || 'Payment capture failed')
            }
          } catch (err: any) {
            console.error('[PayPal] Capture Order Error:', err)
            onError(err.message || 'Failed to verify payment')
          } finally {
            setProcessing(false)
          }
        },
        
        onCancel: (data: any) => {
          console.log('[PayPal] Payment cancelled by user:', data.orderID)
          setProcessing(false)
          // Don't show error for cancelled payments - it's a user action
          // onError('Payment cancelled')
        },
        
        onError: (err: any) => {
          console.error('[PayPal] JS SDK Error:', err)
          setProcessing(false)
          onError('An error occurred with PayPal')
        }
      }).render(buttonRef.current)
    }
  }, [loaded, amount, orderId, onSuccess, onError, onBeforeCreate, processing])

  // Handle script loading error
  const handleScriptError = () => {
    console.error('[PayPal] Failed to load PayPal SDK')
    setScriptError(true)
    onError('Failed to load PayPal. Please refresh the page.')
  }

  if (scriptError) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-md text-center">
        <p className="text-sm text-red-800">
          Failed to load PayPal payment system.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[150px] flex flex-col items-center justify-center relative">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&components=buttons`}
        onLoad={() => {
          console.log('[PayPal] SDK loaded successfully')
          setLoaded(true)
        }}
        onError={handleScriptError}
      />
      
      {!loaded && !scriptError && (
        <div className="w-full space-y-2">
          <div className="animate-pulse bg-gray-200 h-11 w-full rounded" />
          <p className="text-xs text-gray-500 text-center">Loading PayPal...</p>
        </div>
      )}
      
      {processing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-700 font-medium">Processing payment...</p>
          </div>
        </div>
      )}
      
      {/* Terms not accepted overlay */}
      {!termsAccepted && loaded && (
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gray-100/90 backdrop-blur-sm flex items-center justify-center z-20 rounded cursor-not-allowed"
        >
          <div className="text-center p-4">
            <p className="text-sm text-gray-600 font-medium">
              Please accept the Terms & Conditions below to use PayPal
            </p>
          </div>
        </div>
      )}
      
      <div ref={buttonRef} className={`w-full ${!termsAccepted ? 'pointer-events-none opacity-50' : ''}`} />
    </div>
  )
}

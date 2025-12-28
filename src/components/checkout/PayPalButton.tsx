'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface PayPalButtonProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({ amount, orderId, onSuccess, onError }: PayPalButtonProps) {
  const [loaded, setLoaded] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loaded && window.paypal && buttonRef.current) {
      // Clear previous button if any
      buttonRef.current.innerHTML = ''
      
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const response = await fetch('/api/checkout/paypal/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, orderId })
            })
            const order = await response.json()
            return order.id
          } catch (err) {
            console.error('Create Order Error:', err)
            onError('Failed to initiate PayPal transaction')
          }
        },
        onApprove: async (data: any) => {
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
              onSuccess()
            } else {
              onError('Payment capture failed')
            }
          } catch (err) {
            console.error('Capture Order Error:', err)
            onError('Failed to verify payment')
          }
        },
        onError: (err: any) => {
          console.error('PayPal JS SDK Error:', err)
          onError('An error occurred with PayPal')
        }
      }).render(buttonRef.current)
    }
  }, [loaded, amount, orderId, onSuccess, onError])

  return (
    <div className="w-full min-h-[150px] flex flex-col items-center justify-center">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <div className="animate-pulse bg-gray-200 h-10 w-full rounded" />}
      <div ref={buttonRef} className="w-full" />
    </div>
  )
}

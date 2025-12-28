'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Script from 'next/script'
import { Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BraintreeHostedFieldsProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
  onBeforeTokenize?: () => boolean
  termsAccepted?: boolean
}

declare global {
  interface Window {
    braintree?: any
  }
}

export default function BraintreeHostedFields({
  amount,
  orderId,
  onSuccess,
  onError,
  onBeforeTokenize,
  termsAccepted = false
}: BraintreeHostedFieldsProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [hostedFieldsInstance, setHostedFieldsInstance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldStates, setFieldStates] = useState({
    number: { isValid: false, isEmpty: true, isFocused: false },
    expirationDate: { isValid: false, isEmpty: true, isFocused: false },
    cvv: { isValid: false, isEmpty: true, isFocused: false }
  })

  const cardNumberRef = useRef<HTMLDivElement>(null)
  const expirationDateRef = useRef<HTMLDivElement>(null)
  const cvvRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)
  const hostedFieldsRef = useRef<any>(null)

  // Single initialization effect that handles everything
  useEffect(() => {
    mountedRef.current = true
    
    const initialize = async () => {
      // Step 1: Check if SDK is already loaded
      if (window.braintree?.hostedFields) {
        console.log('[Braintree] SDK already available')
        setSdkLoaded(true)
      }
      
      // Step 2: Fetch client token
      try {
        console.log('[Braintree] Fetching client token...')
        const response = await fetch('/api/braintree/token')
        if (!response.ok) {
          throw new Error('Failed to fetch client token')
        }
        const data = await response.json()
        if (!mountedRef.current) return
        setClientToken(data.clientToken)
        console.log('[Braintree] Client token received')
      } catch (err: any) {
        console.error('[Braintree] Token fetch error:', err)
        if (mountedRef.current) {
          setError('Failed to initialize payment system. Please refresh the page.')
          setLoading(false)
        }
      }
    }
    
    initialize()
    
    // Cleanup
    return () => {
      mountedRef.current = false
      if (hostedFieldsRef.current) {
        try {
          hostedFieldsRef.current.teardown()
          hostedFieldsRef.current = null
          console.log('[Braintree] Hosted Fields torn down')
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [])

  // Initialize Hosted Fields when SDK and token are ready
  const initializeHostedFields = useCallback(async () => {
    if (!window.braintree?.hostedFields || !clientToken) return
    if (!cardNumberRef.current || !expirationDateRef.current || !cvvRef.current) return
    if (hostedFieldsInstance) return // Already initialized

    // Clear any existing iframes from previous renders
    if (cardNumberRef.current) cardNumberRef.current.innerHTML = ''
    if (expirationDateRef.current) expirationDateRef.current.innerHTML = ''
    if (cvvRef.current) cvvRef.current.innerHTML = ''

    console.log('[Braintree] Initializing Hosted Fields...')

    try {
      // Create client
      const clientInstance = await window.braintree.client.create({
        authorization: clientToken
      })

      // Create hosted fields
      const hostedFields = await window.braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '16px',
            'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            'color': '#1f2937',
            'padding': '12px 14px',
            'line-height': '1.5'
          },
          'input::placeholder': {
            'color': '#9ca3af'
          },
          '.valid': {
            'color': '#059669'
          },
          '.invalid': {
            'color': '#dc2626'
          },
          ':focus': {
            'color': '#1f2937'
          }
        },
        fields: {
          number: {
            container: cardNumberRef.current,
            placeholder: '4111 1111 1111 1111'
          },
          expirationDate: {
            container: expirationDateRef.current,
            placeholder: 'MM / YY'
          },
          cvv: {
            container: cvvRef.current,
            placeholder: '123'
          }
        }
      })

      // Set up event listeners
      hostedFields.on('validityChange', (event: any) => {
        setFieldStates(prev => ({
          ...prev,
          [event.emittedBy]: {
            isValid: event.fields[event.emittedBy].isValid,
            isEmpty: event.fields[event.emittedBy].isEmpty,
            isFocused: prev[event.emittedBy as keyof typeof prev].isFocused
          }
        }))
      })

      hostedFields.on('focus', (event: any) => {
        setFieldStates(prev => ({
          ...prev,
          [event.emittedBy]: {
            ...prev[event.emittedBy as keyof typeof prev],
            isFocused: true
          }
        }))
      })

      hostedFields.on('blur', (event: any) => {
        setFieldStates(prev => ({
          ...prev,
          [event.emittedBy]: {
            ...prev[event.emittedBy as keyof typeof prev],
            isFocused: false
          }
        }))
      })

      hostedFieldsRef.current = hostedFields
      setHostedFieldsInstance(hostedFields)
      setLoading(false)
      console.log('[Braintree] Hosted Fields initialized successfully')

    } catch (err: any) {
      console.error('[Braintree] Initialization error:', err)
      setError('Failed to load card payment form. Please try again.')
      setLoading(false)
    }
  }, [clientToken, hostedFieldsInstance])

  // Initialize when SDK loads and token is ready
  useEffect(() => {
    if (sdkLoaded && clientToken && !hostedFieldsInstance) {
      // Small delay to ensure DOM refs are attached
      const timer = setTimeout(() => {
        initializeHostedFields()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [sdkLoaded, clientToken, initializeHostedFields, hostedFieldsInstance])

  // Handle payment submission
  const handleSubmit = async () => {
    if (!hostedFieldsInstance || processing) return

    // Check T&C acceptance first
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions to proceed.')
      return
    }

    // Validate with parent before proceeding
    if (onBeforeTokenize && !onBeforeTokenize()) {
      return
    }

    // Check if all fields are valid
    const allValid = Object.values(fieldStates).every(f => f.isValid)
    if (!allValid) {
      setError('Please fill in all card details correctly.')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Tokenize card
      const { nonce } = await hostedFieldsInstance.tokenize()
      console.log('[Braintree] Card tokenized successfully')

      // Send to server
      const response = await fetch('/api/braintree/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodNonce: nonce,
          amount,
          orderId
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('[Braintree] Payment successful:', result.transactionId)
        onSuccess()
      } else {
        throw new Error(result.error || 'Payment failed')
      }
    } catch (err: any) {
      console.error('[Braintree] Payment error:', err)
      const errorMessage = err.message || 'Payment processing failed. Please try again.'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const getFieldClass = (field: keyof typeof fieldStates) => {
    const state = fieldStates[field]
    let classes = 'border rounded-lg transition-all duration-200 bg-white overflow-hidden '
    
    if (state.isFocused) {
      classes += 'border-blue-500 ring-2 ring-blue-100 '
    } else if (!state.isEmpty && state.isValid) {
      classes += 'border-green-500 '
    } else if (!state.isEmpty && !state.isValid) {
      classes += 'border-red-500 '
    } else {
      classes += 'border-gray-300 hover:border-gray-400 '
    }
    
    return classes
  }

  if (error && !hostedFieldsInstance) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
            <p className="text-xs text-red-700 mt-1">
              Please try another payment method or refresh the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Load Braintree SDK */}
      <Script
        src="https://js.braintreegateway.com/web/3.101.0/js/client.min.js"
        onLoad={() => {
          console.log('[Braintree] Client SDK loaded')
        }}
      />
      <Script
        src="https://js.braintreegateway.com/web/3.101.0/js/hosted-fields.min.js"
        onLoad={() => {
          console.log('[Braintree] Hosted Fields SDK loaded')
          setSdkLoaded(true)
        }}
      />

      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-14 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-14 bg-gray-200 rounded-lg"></div>
                <div className="h-14 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading secure payment form...</span>
            </div>
          </div>
        )}

        {/* Card Fields */}
        <div className={loading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}>
          {/* Header with Card Icons */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-tight text-gray-900">
              Card Details
            </h3>
            <div className="flex items-center gap-2">
              <Image src="/payment-logos/visa.svg" alt="Visa" width={32} height={20} className="opacity-70" />
              <Image src="/payment-logos/mastercard.svg" alt="Mastercard" width={32} height={20} className="opacity-70" />
              <Image src="/payment-logos/amex.svg" alt="Amex" width={32} height={20} className="opacity-70" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Card Number */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Card Number <span className="text-red-500">*</span>
            </label>
            <div
              ref={cardNumberRef}
              className={getFieldClass('number')}
              style={{ height: '50px' }}
            />
            {!fieldStates.number.isEmpty && !fieldStates.number.isValid && (
              <p className="text-xs text-red-600">Please enter a valid card number</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div
                ref={expirationDateRef}
                className={getFieldClass('expirationDate')}
                style={{ height: '50px' }}
              />
              {!fieldStates.expirationDate.isEmpty && !fieldStates.expirationDate.isValid && (
                <p className="text-xs text-red-600">Invalid expiry</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CVV <span className="text-red-500">*</span>
              </label>
              <div
                ref={cvvRef}
                className={getFieldClass('cvv')}
                style={{ height: '50px' }}
              />
              {!fieldStates.cvv.isEmpty && !fieldStates.cvv.isValid && (
                <p className="text-xs text-red-600">Invalid CVV</p>
              )}
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing || loading || !termsAccepted}
            className={cn(
              "w-full mt-6 h-12 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
              termsAccepted 
                ? "bg-black hover:bg-gray-800 text-white disabled:bg-gray-400" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : !termsAccepted ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Accept T&C to Pay</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Pay Now</span>
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Processing your payment</p>
              <p className="text-sm text-gray-500">Please don't close this window...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

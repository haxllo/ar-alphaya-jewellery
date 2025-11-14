// PayHere SDK Loader and Initialization

import type { PayHerePayment, PayHereCallbacks } from '@/types/payhere'

const PAYHERE_SCRIPT_ID = 'payhere-sdk'
const PAYHERE_SCRIPT_URL = 'https://www.payhere.lk/lib/payhere.js'

/**
 * Load PayHere SDK dynamically
 * @returns Promise that resolves when SDK is loaded
 */
export const loadPayHereSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.payhere) {
      resolve()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.getElementById(PAYHERE_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Failed to load PayHere SDK')))
      return
    }

    // Create and load script
    const script = document.createElement('script')
    script.id = PAYHERE_SCRIPT_ID
    script.src = PAYHERE_SCRIPT_URL
    script.type = 'text/javascript'
    script.async = true

    script.onload = () => {
      if (window.payhere) {
        resolve()
      } else {
        reject(new Error('PayHere SDK loaded but not available'))
      }
    }

    script.onerror = () => {
      reject(new Error('Failed to load PayHere SDK'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Initialize PayHere payment with callbacks
 * @param payment - Payment data from backend
 * @param callbacks - Payment event callbacks
 */
export const initializePayment = async (
  payment: PayHerePayment,
  callbacks: PayHereCallbacks
): Promise<void> => {
  try {
    // Ensure SDK is loaded
    await loadPayHereSDK()

    if (!window.payhere) {
      throw new Error('PayHere SDK not available')
    }

    // Debug: Log payment data (remove in production)
    console.log('Initializing PayHere with data:', {
      ...payment,
      hash: payment.hash ? `${payment.hash.substring(0, 10)}...` : 'missing',
      merchant_secret: '***hidden***'
    })

    // Set up callbacks
    window.payhere.onCompleted = callbacks.onCompleted
    window.payhere.onDismissed = callbacks.onDismissed
    window.payhere.onError = callbacks.onError

    // Start payment
    window.payhere.startPayment(payment)
  } catch (error) {
    console.error('PayHere initialization error:', error)
    throw error
  }
}

/**
 * Check if PayHere SDK is loaded
 */
export const isPayHereLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.payhere
}

/**
 * Unload PayHere SDK (cleanup)
 */
export const unloadPayHereSDK = (): void => {
  const script = document.getElementById(PAYHERE_SCRIPT_ID)
  if (script) {
    script.remove()
  }
  if (window.payhere) {
    delete window.payhere
  }
}

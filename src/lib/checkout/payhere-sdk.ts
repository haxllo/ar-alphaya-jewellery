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
 * Create custom modal wrapper for PayHere
 */
const createModalWrapper = (): HTMLDivElement => {
  const backdrop = document.createElement('div')
  backdrop.id = 'payhere-custom-backdrop'
  backdrop.className = 'payhere-modal-backdrop'
  
  backdrop.innerHTML = `
    <div class="payhere-modal-container">
      <div class="payhere-secure-badge">
        <svg class="payhere-lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure Payment by PayHere</span>
      </div>
      <div class="payhere-loading-skeleton" id="payhere-loading">
        <div class="skeleton-header"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-footer"></div>
      </div>
      <div class="payhere-iframe-wrapper" id="payhere-iframe-wrapper"></div>
    </div>
  `
  
  return backdrop
}

/**
 * Show modal wrapper with animation
 */
const showModalWrapper = (): void => {
  const existing = document.getElementById('payhere-custom-backdrop')
  if (existing) return
  
  const wrapper = createModalWrapper()
  document.body.appendChild(wrapper)
  document.body.style.overflow = 'hidden'
  
  // Trigger animation
  requestAnimationFrame(() => {
    wrapper.classList.add('active')
  })
  
  // Hide loading skeleton after PayHere iframe loads (estimate 2s)
  setTimeout(() => {
    const loading = document.getElementById('payhere-loading')
    if (loading) {
      loading.style.opacity = '0'
      setTimeout(() => loading.remove(), 300)
    }
  }, 2000)
}

/**
 * Hide modal wrapper with animation
 */
const hideModalWrapper = (): void => {
  const wrapper = document.getElementById('payhere-custom-backdrop')
  if (wrapper) {
    wrapper.classList.remove('active')
    setTimeout(() => {
      wrapper.remove()
      document.body.style.overflow = ''
    }, 300)
  }
}

/**
 * Initialize PayHere payment with callbacks and custom modal
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

    // Show custom modal wrapper
    showModalWrapper()

    // Wrap callbacks with modal cleanup
    const wrappedCallbacks = {
      onCompleted: (orderId: string) => {
        hideModalWrapper()
        callbacks.onCompleted(orderId)
      },
      onDismissed: () => {
        hideModalWrapper()
        callbacks.onDismissed()
      },
      onError: (error: string) => {
        hideModalWrapper()
        callbacks.onError(error)
      }
    }

    // Set up callbacks
    window.payhere.onCompleted = wrappedCallbacks.onCompleted
    window.payhere.onDismissed = wrappedCallbacks.onDismissed
    window.payhere.onError = wrappedCallbacks.onError

    // Start payment
    window.payhere.startPayment(payment)
  } catch (error) {
    hideModalWrapper()
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

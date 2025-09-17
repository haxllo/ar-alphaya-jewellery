'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/lib/store/cart'

interface AbandonedCartOptions {
  email?: string
  delay?: number // milliseconds before considering cart abandoned
}

export function useAbandonedCart(options: AbandonedCartOptions = {}) {
  const { email, delay = 30 * 60 * 1000 } = options // 30 minutes default
  const items = useCartStore((state) => state.items)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  const recordAbandonedCart = async () => {
    if (!email || items.length === 0) return

    try {
      await fetch('/api/abandoned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      })
    } catch (error) {
      console.warn('Failed to record abandoned cart:', error)
    }
  }

  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (items.length > 0) {
      timeoutRef.current = setTimeout(() => {
        recordAbandonedCart()
      }, delay)
    }
  }

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [])

  // Track cart changes
  useEffect(() => {
    resetTimer()
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [items, email, delay])

  // Record on page unload if cart has items
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (items.length > 0 && email) {
        // Use sendBeacon for reliable delivery on page unload
        const data = JSON.stringify({
          email,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        })
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/abandoned', data)
        } else {
          // Fallback for older browsers
          recordAbandonedCart()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [items, email])

  return {
    recordAbandonedCart,
    resetTimer,
  }
}

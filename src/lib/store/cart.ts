import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { analytics } from '@/lib/analytics'
import type { CartItem } from '@/types/product'

interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

export type CartState = {
  items: CartItem[]
  promoCode: PromoCode | null
  isLoading: boolean
  isSyncing: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  clear: () => void
  clearImmediate: () => void
  setQuantity: (productId: string, quantity: number, size?: string) => void
  syncToServer: (items: CartItem[], email?: string) => Promise<void>
  loadFromServer: () => Promise<void>
  applyPromoCode: (code: string, discount: number, type: 'percentage' | 'fixed') => void
  removePromoCode: () => void
}

// Debounced sync function to avoid too many API calls
let syncTimeout: NodeJS.Timeout | null = null

const debouncedSync = (items: CartItem[], email?: string) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout)
  }
  syncTimeout = setTimeout(async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email }),
      })
    } catch (error) {
      console.warn('Failed to sync cart to server:', error)
    }
  }, 1000) // Wait 1 second after last change
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      isLoading: false,
      isSyncing: false,
      addItem: (item) => {
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size,
          )
          let newItems: CartItem[]
          if (idx >= 0) {
            newItems = [...state.items]
            newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity + item.quantity }
          } else {
            newItems = [...state.items, item]
          }
          // Sync to server
          debouncedSync(newItems)
          return { items: newItems }
        })
      },
      removeItem: (productId, size) => {
        set((state) => {
          const newItems = state.items.filter((i) => !(i.productId === productId && i.size === size))
          // Sync to server
          debouncedSync(newItems)
          return { items: newItems }
        })
      },
      clear: () => {
        // Debounced clear to prevent race conditions
        setTimeout(() => {
          set({ items: [] })
          debouncedSync([])
        }, 100)
      },
      clearImmediate: () => {
        // Force immediate clear with localStorage sync
        set({ items: [], promoCode: null })
        // Ensure localStorage is cleared immediately
        try {
          localStorage.removeItem('ar-alphaya-cart')
        } catch (error) {
          console.warn('Failed to clear cart from localStorage:', error)
        }
        // Sync to server
        debouncedSync([])
      },
      setQuantity: (productId, quantity, size) => {
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i,
          )
          // Sync to server
          debouncedSync(newItems)
          return { items: newItems }
        })
      },
      syncToServer: async (items, email) => {
        set({ isSyncing: true })
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, email }),
          })
          if (!response.ok) {
            throw new Error('Failed to sync cart')
          }
        } catch (error) {
          console.warn('Failed to sync cart to server:', error)
        } finally {
          set({ isSyncing: false })
        }
      },
      loadFromServer: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart')
          if (response.ok) {
            const data = await response.json()
            if (data.items && data.items.length > 0) {
              set({ items: data.items })
            }
          }
        } catch (error) {
          console.warn('Failed to load cart from server:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      applyPromoCode: (code, discount, type) => {
        set({ promoCode: { code, discount, type } })
      },
      removePromoCode: () => {
        set({ promoCode: null })
      },
    }),
    { name: 'ar-alphaya-cart' },
  ),
)


import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/product'

interface SavedItemsState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  moveToCart: (productId: string, size?: string) => CartItem | null
  clear: () => void
}

export const useSavedItemsStore = create<SavedItemsState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
          )
          
          if (existingIndex > -1) {
            return state
          }
          
          return {
            items: [...state.items, { ...item, savedAt: new Date().toISOString() }]
          }
        })
      },
      
      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
        }))
      },
      
      moveToCart: (productId, size) => {
        const item = get().items.find(
          (i) => i.productId === productId && i.size === size
        )
        
        if (item) {
          get().removeItem(productId, size)
          return item
        }
        
        return null
      },
      
      clear: () => set({ items: [] })
    }),
    {
      name: 'saved-items-storage',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentlyViewedProduct {
  id: string
  slug: string
  name: string
  price: number
  image?: string
  category: string
  viewedAt: string
}

interface RecentlyViewedState {
  products: RecentlyViewedProduct[]
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void
  clearHistory: () => void
  getRecentProducts: (limit?: number) => RecentlyViewedProduct[]
}

const MAX_RECENT_PRODUCTS = 10

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.products.filter(p => p.id !== product.id)
          
          // Add to beginning with timestamp
          const updated = [
            { ...product, viewedAt: new Date().toISOString() },
            ...filtered
          ]
          
          // Keep only last MAX_RECENT_PRODUCTS
          return {
            products: updated.slice(0, MAX_RECENT_PRODUCTS)
          }
        })
      },
      
      clearHistory: () => set({ products: [] }),
      
      getRecentProducts: (limit = MAX_RECENT_PRODUCTS) => {
        return get().products.slice(0, limit)
      }
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

interface ComparisonState {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  clearProducts: () => void
  isInComparison: (productId: string) => boolean
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const { products } = get()
        if (products.length >= 4) {
          // Replace the first product if we're at the limit
          set({ products: [...products.slice(1), product] })
        } else if (!products.find(p => p.id === product.id)) {
          set({ products: [...products, product] })
        }
      },
      removeProduct: (productId) => {
        set({ products: get().products.filter(p => p.id !== productId) })
      },
      clearProducts: () => {
        set({ products: [] })
      },
      isInComparison: (productId) => {
        return get().products.some(p => p.id === productId)
      },
    }),
    {
      name: 'comparison-storage',
    }
  )
)

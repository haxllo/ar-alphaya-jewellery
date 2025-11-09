import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

interface ComparisonItem {
  id: string
  slug: string
  name: string
  price: number
  image?: string
  category: string
}

interface ComparisonState {
  items: ComparisonItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearAll: () => void
  isInComparison: (productId: string) => boolean
  // Legacy support
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  clearProducts: () => void
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],
      products: [], // Legacy
      
      addItem: (product) => {
        const { items } = get()
        if (items.length >= 4) {
          return // Don't add more than 4
        }
        if (!items.find(p => p.id === product.id)) {
          const newItem: ComparisonItem = {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            category: product.category
          }
          set({ items: [...items, newItem], products: [...items, newItem] as any })
        }
      },
      
      removeItem: (productId) => {
        const newItems = get().items.filter(p => p.id !== productId)
        set({ items: newItems, products: newItems as any })
      },
      
      clearAll: () => {
        set({ items: [], products: [] })
      },
      
      isInComparison: (productId) => {
        return get().items.some(p => p.id === productId)
      },
      
      // Legacy methods
      addProduct: (product) => {
        get().addItem(product)
      },
      removeProduct: (productId) => {
        get().removeItem(productId)
      },
      clearProducts: () => {
        get().clearAll()
      },
    }),
    {
      name: 'comparison-storage',
    }
  )
)

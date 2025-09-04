import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, WishlistItem, WishlistState } from '@/types/product'

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const { items } = get()
        const existingItem = items.find(item => item.productId === product.id)
        
        if (!existingItem) {
          const newItem: WishlistItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            category: product.category,
            materials: product.materials,
            image: product.images?.[0],
            addedAt: new Date().toISOString()
          }
          
          set({
            items: [...items, newItem]
          })
        }
      },

      removeItem: (productId: string) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      },

      isInWishlist: (productId: string) => {
        const { items } = get()
        return items.some(item => item.productId === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        const { items } = get()
        return items.length
      }
    }),
    {
      name: 'ar-alphaya-wishlist',
      partialize: (state) => ({ items: state.items })
    }
  )
)

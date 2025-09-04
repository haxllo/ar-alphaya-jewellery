import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/product'

export type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  clear: () => void
  setQuantity: (productId: string, quantity: number, size?: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size,
          )
          if (idx >= 0) {
            const items = [...state.items]
            items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity }
            return { items }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId, size) =>
        set((state) => ({ items: state.items.filter((i) => !(i.productId === productId && i.size === size)) })),
      clear: () => set({ items: [] }),
      setQuantity: (productId, quantity, size) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i,
          ),
        })),
    }),
    { name: 'ar-alphaya-cart' },
  ),
)


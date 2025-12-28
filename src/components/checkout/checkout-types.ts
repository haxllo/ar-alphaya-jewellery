// Shared types for checkout components

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode?: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface TouchedFields {
  [key: string]: boolean
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  size?: string
  gemstone?: string
  image?: string
}

export type PaymentMethod = 'bank_transfer' | 'payzy' | 'paypal' | 'card'

export interface CheckoutStep {
  id: number
  label: string
  icon: string
}

// PayHere SDK TypeScript definitions

export interface PayHerePayment {
  sandbox: boolean
  merchant_id: string
  return_url?: string | undefined  // Optional with JS SDK modal
  cancel_url?: string | undefined  // Optional with JS SDK modal
  notify_url: string
  order_id: string
  items: string
  currency: string
  amount: number
  hash: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  delivery_address?: string
  delivery_city?: string
  delivery_country?: string
}

export interface PayHereCallbacks {
  onCompleted: (orderId: string) => void
  onDismissed: () => void
  onError: (error: string) => void
}

export interface PayHere {
  startPayment: (payment: PayHerePayment) => void
  onCompleted: (orderId: string) => void
  onDismissed: () => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    payhere?: PayHere
  }
}

export {}

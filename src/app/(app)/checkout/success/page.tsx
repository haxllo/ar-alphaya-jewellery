import { Suspense } from 'react'
import CheckoutSuccessContent from '@/components/checkout/CheckoutSuccessContent'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Order Successful - AR Alphaya Jewellery',
  description: 'Your order has been successfully placed',
}
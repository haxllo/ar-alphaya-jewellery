export {}

declare global {
  interface Window {
    payhere?: {
      startPayment: (paymentData: any) => void
      onCompleted?: (orderId: string) => void
      onDismissed?: () => void
      onError?: (error: string) => void
    }
    netlifyIdentity?: any
  }
}

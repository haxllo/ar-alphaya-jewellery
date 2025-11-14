// Order utility functions

/**
 * Generate a unique order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `ORDER-${timestamp}-${random}`
}

/**
 * Format order status for display
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }
  
  return statusMap[status] || status
}

/**
 * Get status color for badges
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-orange-100 text-orange-800 border-orange-200',
  }
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Calculate order total with shipping
 */
export const calculateOrderTotal = (
  subtotal: number,
  shipping: number = 1000,
  tax: number = 0
): number => {
  return subtotal + shipping + tax
}

/**
 * Format currency for Sri Lankan Rupees
 */
export const formatLKR = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Convert cents to rupees
 */
export const centsToRupees = (cents: number): number => {
  return cents / 100
}

/**
 * Convert rupees to cents
 */
export const rupeesToCents = (rupees: number): number => {
  return Math.round(rupees * 100)
}

/**
 * Validate order items
 */
export const validateOrderItems = (items: any[]): boolean => {
  if (!items || items.length === 0) return false
  
  return items.every(item => 
    item.productId &&
    item.name &&
    item.price > 0 &&
    item.quantity > 0
  )
}

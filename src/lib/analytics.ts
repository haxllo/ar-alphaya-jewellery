// Enhanced analytics tracking for AR Alphaya Jewellery

interface AnalyticsEvent {
  event: string
  category?: string
  action?: string
  label?: string
  value?: number
  [key: string]: any
}

class Analytics {
  private initialized = false

  // Initialize analytics (Google Analytics, Meta Pixel, etc.)
  init() {
    if (this.initialized || typeof window === 'undefined') return
    
    // Check if gtag is available
    if (typeof window.gtag !== 'undefined') {
      this.initialized = true
      console.log('[Analytics] Initialized')
    }
  }

  // Track custom events
  track(eventData: AnalyticsEvent) {
    if (typeof window === 'undefined') return

    const { event, ...data } = eventData

    // Google Analytics 4
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event, data)
    }

    // Facebook Pixel
    if (typeof window.fbq !== 'undefined') {
      window.fbq('trackCustom', event, data)
    }

    console.log('[Analytics] Event:', event, data)
  }

  // E-commerce events
  viewItem(product: any) {
    this.track({
      event: 'view_item',
      currency: product.currency || 'LKR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        currency: product.currency || 'LKR'
      }]
    })
  }

  addToCart(product: any, quantity: number = 1) {
    this.track({
      event: 'add_to_cart',
      currency: product.currency || 'LKR',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity
      }]
    })
  }

  removeFromCart(product: any, quantity: number = 1) {
    this.track({
      event: 'remove_from_cart',
      currency: product.currency || 'LKR',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    })
  }

  viewCart(items: any[], totalValue: number) {
    this.track({
      event: 'view_cart',
      currency: 'LKR',
      value: totalValue,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }

  beginCheckout(items: any[], totalValue: number) {
    this.track({
      event: 'begin_checkout',
      currency: 'LKR',
      value: totalValue,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }

  purchase(orderId: string, items: any[], totalValue: number, tax: number = 0, shipping: number = 0) {
    this.track({
      event: 'purchase',
      transaction_id: orderId,
      value: totalValue,
      tax: tax,
      shipping: shipping,
      currency: 'LKR',
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }

  // Wishlist events
  addToWishlist(product: any) {
    this.track({
      event: 'add_to_wishlist',
      currency: product.currency || 'LKR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price
      }]
    })
  }

  // Comparison events
  addToComparison(product: any) {
    this.track({
      event: 'add_to_comparison',
      item_id: product.id,
      item_name: product.name,
      item_category: product.category
    })
  }

  viewComparison(products: any[]) {
    this.track({
      event: 'view_comparison',
      item_count: products.length,
      items: products.map(p => ({
        item_id: p.id,
        item_name: p.name
      }))
    })
  }

  // Search events
  search(searchTerm: string, resultsCount: number) {
    this.track({
      event: 'search',
      search_term: searchTerm,
      results_count: resultsCount
    })
  }

  // User engagement
  shareProduct(product: any, method: string) {
    this.track({
      event: 'share',
      method: method,
      content_type: 'product',
      item_id: product.id,
      item_name: product.name
    })
  }

  contactInquiry(productId?: string, productName?: string) {
    this.track({
      event: 'contact_inquiry',
      item_id: productId,
      item_name: productName
    })
  }

  // Promo code events
  applyPromoCode(code: string, discountValue: number) {
    this.track({
      event: 'apply_promo_code',
      promo_code: code,
      discount_value: discountValue
    })
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
    analytics: Analytics
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Auto-initialize on client
if (typeof window !== 'undefined') {
  window.analytics = analytics
  analytics.init()
}

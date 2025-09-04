export interface NewsletterSubscription {
  email: string
  subscribedAt: string
  preferences?: {
    newProducts?: boolean
    sales?: boolean
    styleGuides?: boolean
    exclusiveEvents?: boolean
  }
  source?: string // e.g., 'homepage', 'cart', 'footer'
}

export interface NewsletterResponse {
  success: boolean
  message: string
  subscriptionId?: string
}

export class NewsletterService {
  private static readonly API_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL || '/api/newsletter'
  
  /**
   * Subscribe an email to the newsletter
   */
  static async subscribe(
    email: string, 
    preferences?: NewsletterSubscription['preferences'],
    source?: string
  ): Promise<NewsletterResponse> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        }
      }

      // Check if already subscribed (in a real app, this would be handled by the backend)
      const existingSubscription = this.getStoredSubscription(email)
      if (existingSubscription) {
        return {
          success: true,
          message: 'You\'re already subscribed to our newsletter!'
        }
      }

      const subscription: NewsletterSubscription = {
        email,
        subscribedAt: new Date().toISOString(),
        preferences: preferences || {
          newProducts: true,
          sales: true,
          styleGuides: true,
          exclusiveEvents: true
        },
        source
      }

      // In a real implementation, this would be an API call
      // const response = await fetch(this.API_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(subscription),
      // })
      
      // For demo purposes, simulate API delay and occasional failures
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
      
      // 5% chance of failure for demo
      if (Math.random() < 0.05) {
        throw new Error('Network error - please try again')
      }

      // Store subscription locally for demo
      this.storeSubscription(subscription)

      // Simulate different responses
      const responses = [
        'Welcome to AR Alphaya Jewellery newsletter!',
        'Thank you for subscribing! Check your inbox for a welcome offer.',
        'Successfully subscribed! You\'ll receive our latest updates.',
      ]

      return {
        success: true,
        message: responses[Math.floor(Math.random() * responses.length)],
        subscriptionId: `sub_${Date.now()}`
      }

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      }
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(email: string, subscriptionId?: string): Promise<NewsletterResponse> {
    try {
      // In a real implementation:
      // const response = await fetch(`${this.API_ENDPOINT}/unsubscribe`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, subscriptionId }),
      // })

      // For demo, remove from local storage
      this.removeStoredSubscription(email)

      return {
        success: true,
        message: 'Successfully unsubscribed from our newsletter.'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again or contact support.'
      }
    }
  }

  /**
   * Update subscription preferences
   */
  static async updatePreferences(
    email: string, 
    preferences: NewsletterSubscription['preferences']
  ): Promise<NewsletterResponse> {
    try {
      const existing = this.getStoredSubscription(email)
      if (!existing) {
        return {
          success: false,
          message: 'Subscription not found'
        }
      }

      const updated: NewsletterSubscription = {
        ...existing,
        preferences
      }

      this.storeSubscription(updated)

      return {
        success: true,
        message: 'Newsletter preferences updated successfully!'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update preferences. Please try again.'
      }
    }
  }

  /**
   * Get subscription analytics (for admin dashboard)
   */
  static getSubscriptionStats(): {
    totalSubscribers: number
    recentSubscriptions: NewsletterSubscription[]
    topSources: Array<{ source: string; count: number }>
  } {
    const subscriptions = this.getAllStoredSubscriptions()
    
    // Get recent subscriptions (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recent = subscriptions.filter(sub => 
      new Date(sub.subscribedAt) > weekAgo
    )

    // Count sources
    const sourceCounts: Record<string, number> = {}
    subscriptions.forEach(sub => {
      const source = sub.source || 'unknown'
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })

    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalSubscribers: subscriptions.length,
      recentSubscriptions: recent,
      topSources
    }
  }

  // Helper methods
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim().toLowerCase())
  }

  private static getStorageKey(): string {
    return 'ar-alphaya-newsletter-subscriptions'
  }

  private static storeSubscription(subscription: NewsletterSubscription): void {
    if (typeof window === 'undefined') return

    try {
      const existing = this.getAllStoredSubscriptions()
      const updated = existing.filter(sub => sub.email !== subscription.email)
      updated.push(subscription)
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to store subscription:', error)
    }
  }

  private static getStoredSubscription(email: string): NewsletterSubscription | null {
    if (typeof window === 'undefined') return null

    try {
      const subscriptions = this.getAllStoredSubscriptions()
      return subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase()) || null
    } catch (error) {
      return null
    }
  }

  private static getAllStoredSubscriptions(): NewsletterSubscription[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.getStorageKey())
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  }

  private static removeStoredSubscription(email: string): void {
    if (typeof window === 'undefined') return

    try {
      const existing = this.getAllStoredSubscriptions()
      const updated = existing.filter(sub => sub.email.toLowerCase() !== email.toLowerCase())
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to remove subscription:', error)
    }
  }
}

// Export utility functions
export const subscribeToNewsletter = NewsletterService.subscribe
export const unsubscribeFromNewsletter = NewsletterService.unsubscribe

import { createClientClient } from '@/lib/supabase'

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

      // Call the API endpoint
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: preferences || {
            newProducts: true,
            sales: true,
            styleGuides: true,
            exclusiveEvents: true
          },
          source
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to subscribe to newsletter'
        }
      }

      return {
        success: true,
        message: data.message || 'Successfully subscribed to our newsletter!',
        subscriptionId: data.subscriptionId
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
      const supabase = createClientClient()
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase().trim())
        .select()
        .single()

      if (error) {
        console.error('Error unsubscribing:', error)
        return {
          success: false,
          message: 'Failed to unsubscribe. Please try again or contact support.'
        }
      }

      return {
        success: true,
        message: 'Successfully unsubscribed from our newsletter.'
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
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
      const supabase = createClientClient()
      
      // Check if subscription exists
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('id, is_active')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (checkError || !existing || !existing.is_active) {
        return {
          success: false,
          message: 'Subscription not found'
        }
      }

      // Update preferences
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          preferences: preferences || {
            newProducts: true,
            sales: true,
            styleGuides: true,
            exclusiveEvents: true
          },
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase().trim())
        .select()
        .single()

      if (error) {
        console.error('Error updating preferences:', error)
        return {
          success: false,
          message: 'Failed to update preferences. Please try again.'
        }
      }

      return {
        success: true,
        message: 'Newsletter preferences updated successfully!',
        subscriptionId: data.id
      }
    } catch (error) {
      console.error('Update preferences error:', error)
      return {
        success: false,
        message: 'Failed to update preferences. Please try again.'
      }
    }
  }

  /**
   * Get subscription analytics (for admin dashboard)
   * Note: This now requires server-side implementation using Supabase
   */
  static async getSubscriptionStats(): Promise<{
    totalSubscribers: number
    activeSubscribers: number
    recentSubscriptions: number
  }> {
    try {
      const supabase = createClientClient()
      
      // Call Supabase function or query directly
      const { data, error } = await supabase.rpc('get_newsletter_stats')

      if (error) {
        console.error('Error fetching newsletter stats:', error)
        return {
          totalSubscribers: 0,
          activeSubscribers: 0,
          recentSubscriptions: 0
        }
      }

      return {
        totalSubscribers: data?.[0]?.total_subscribers || 0,
        activeSubscribers: data?.[0]?.active_subscribers || 0,
        recentSubscriptions: data?.[0]?.recent_subscriptions || 0
      }
    } catch (error) {
      console.error('Error getting subscription stats:', error)
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        recentSubscriptions: 0
      }
    }
  }

  // Helper methods
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim().toLowerCase())
  }
}

// Export utility functions
export const subscribeToNewsletter = NewsletterService.subscribe
export const unsubscribeFromNewsletter = NewsletterService.unsubscribe

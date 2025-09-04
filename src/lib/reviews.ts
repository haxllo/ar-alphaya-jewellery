import type { Review, ReviewSummary } from '@/types/product'

// Mock reviews database - in a real app, this would come from your API
const mockReviews: Review[] = [
  {
    id: 'review-001',
    productId: 'demo-001',
    customerName: 'Sarah Johnson',
    rating: 5,
    title: 'Absolutely stunning!',
    content: 'This sapphire ring exceeded my expectations. The craftsmanship is exceptional and the stone is absolutely gorgeous. Highly recommend!',
    createdAt: '2024-01-15T10:30:00Z',
    verified: true,
    helpful: 12
  },
  {
    id: 'review-002',
    productId: 'demo-001',
    customerName: 'Michael Chen',
    rating: 4,
    title: 'Beautiful ring, great quality',
    content: 'Purchased this as an engagement ring. The quality is excellent and my fiancée loves it. Shipping was fast too.',
    createdAt: '2024-01-10T14:20:00Z',
    verified: true,
    helpful: 8
  },
  {
    id: 'review-003',
    productId: 'demo-002',
    customerName: 'Emma Wilson',
    rating: 5,
    title: 'Perfect everyday earrings',
    content: 'These diamond studs are perfect for everyday wear. They catch the light beautifully and are very comfortable.',
    createdAt: '2024-01-12T09:15:00Z',
    verified: true,
    helpful: 15
  },
  {
    id: 'review-004',
    productId: 'demo-002',
    customerName: 'David Martinez',
    rating: 4,
    title: 'Great gift choice',
    content: 'Bought these for my wife and she absolutely loves them. The packaging was also very elegant.',
    createdAt: '2024-01-08T16:45:00Z',
    verified: true,
    helpful: 6
  },
  {
    id: 'review-005',
    productId: 'demo-003',
    customerName: 'Lisa Thompson',
    rating: 5,
    title: 'Gorgeous ruby pendant',
    content: 'The ruby is so vibrant and the heart shape is perfect. It arrived exactly as shown in the photos.',
    createdAt: '2024-01-14T11:30:00Z',
    verified: true,
    helpful: 9
  }
]

export class ReviewsService {
  // Get reviews for a specific product
  static getProductReviews(productId: string, limit?: number): Review[] {
    const productReviews = mockReviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return limit ? productReviews.slice(0, limit) : productReviews
  }

  // Get review summary for a product
  static getReviewSummary(productId: string): ReviewSummary {
    const productReviews = this.getProductReviews(productId)
    
    if (productReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const totalReviews = productReviews.length
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10

    const ratingDistribution = productReviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

    return {
      totalReviews,
      averageRating,
      ratingDistribution
    }
  }

  // Add a new review
  static async addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0
    }

    // In a real app, this would be an API call
    mockReviews.push(newReview)
    return newReview
  }

  // Mark review as helpful
  static async markReviewHelpful(reviewId: string): Promise<boolean> {
    const review = mockReviews.find(r => r.id === reviewId)
    if (review) {
      review.helpful = (review.helpful || 0) + 1
      return true
    }
    return false
  }

  // Get recent reviews across all products (for homepage, etc.)
  static getRecentReviews(limit: number = 5): Review[] {
    return mockReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  // Get top-rated products based on reviews
  static getTopRatedProducts(limit: number = 6): string[] {
    const productRatings = new Map<string, { total: number; count: number }>()

    mockReviews.forEach(review => {
      const existing = productRatings.get(review.productId) || { total: 0, count: 0 }
      productRatings.set(review.productId, {
        total: existing.total + review.rating,
        count: existing.count + 1
      })
    })

    return Array.from(productRatings.entries())
      .map(([productId, { total, count }]) => ({
        productId,
        averageRating: total / count,
        reviewCount: count
      }))
      .filter(item => item.reviewCount >= 2) // Minimum 2 reviews
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit)
      .map(item => item.productId)
  }
}

// Export mock reviews for testing
export { mockReviews }

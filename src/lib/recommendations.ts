import type { Product, CartItem } from '@/types/product'

// Mock product database - in a real app, this would come from your API
const mockProducts: Product[] = [
  {
    id: 'demo-001',
    slug: 'sample-blue-sapphire-ring',
    name: 'Sample Blue Sapphire Ring',
    description: 'Elegant blue sapphire ring with diamond accents',
    price: 250000,
    category: 'rings',
    images: ['/images/placeholders/placeholder-1.jpg'],
    materials: ['gold', 'sapphire', 'diamond'],
    sizes: ['M', 'L'],
    inStock: true,
    featured: true,
  },
  {
    id: 'demo-002',
    slug: 'sample-diamond-earrings',
    name: 'Sample Diamond Stud Earrings',
    description: 'Classic diamond stud earrings in 18k gold',
    price: 150000,
    category: 'earrings',
    images: ['/images/placeholders/placeholder-2.jpg'],
    materials: ['gold', 'diamond'],
    inStock: true,
    featured: true,
  },
  {
    id: 'demo-003',
    slug: 'sample-ruby-pendant',
    name: 'Sample Ruby Heart Pendant',
    description: 'Beautiful ruby heart pendant on gold chain',
    price: 180000,
    category: 'necklaces',
    images: ['/images/placeholders/placeholder-1.jpg'],
    materials: ['gold', 'ruby'],
    inStock: true,
  },
  {
    id: 'demo-004',
    slug: 'sample-emerald-bracelet',
    name: 'Sample Emerald Tennis Bracelet',
    description: 'Stunning emerald tennis bracelet in white gold',
    price: 320000,
    category: 'bracelets',
    images: ['/images/placeholders/placeholder-3.jpg'],
    materials: ['white-gold', 'emerald'],
    inStock: true,
    featured: true,
  },
  {
    id: 'demo-005',
    slug: 'sample-pearl-necklace',
    name: 'Sample Pearl Strand Necklace',
    description: 'Classic pearl strand necklace with gold clasp',
    price: 95000,
    category: 'necklaces',
    images: ['/images/placeholders/placeholder-2.jpg'],
    materials: ['gold', 'pearl'],
    inStock: true,
  },
  {
    id: 'demo-006',
    slug: 'sample-gold-hoops',
    name: 'Sample Gold Hoop Earrings',
    description: 'Medium size gold hoop earrings',
    price: 75000,
    category: 'earrings',
    images: ['/images/placeholders/placeholder-3.jpg'],
    materials: ['gold'],
    inStock: true,
  }
]

export class RecommendationService {
  // Get related products based on current product
  static getRelatedProducts(currentProduct: Product, limit: number = 4): Product[] {
    const related = mockProducts
      .filter(p => p.id !== currentProduct.id)
      .map(product => ({
        product,
        score: this.calculateSimilarityScore(currentProduct, product)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product)

    return related
  }

  // Get frequently bought together items based on cart contents
  static getFrequentlyBoughtTogether(cartItems: CartItem[], limit: number = 3): Product[] {
    if (cartItems.length === 0) return []

    const cartCategories = new Set(
      cartItems.map(item => this.getCategoryFromProductId(item.productId))
    )
    const cartMaterials = new Set(
      cartItems.flatMap(item => this.getMaterialsFromProductId(item.productId))
    )

    return mockProducts
      .filter(product => !cartItems.some(item => item.productId === product.id))
      .map(product => ({
        product,
        score: this.calculateCartCompatibilityScore(product, cartCategories, cartMaterials)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product)
  }

  // Get trending/featured products
  static getTrendingProducts(limit: number = 6): Product[] {
    return mockProducts
      .filter(p => p.featured)
      .sort((a, b) => (b.price * 0.1) - (a.price * 0.1)) // Simple trending algorithm
      .slice(0, limit)
  }

  // Get products by category
  static getProductsByCategory(category: string, limit: number = 6): Product[] {
    return mockProducts
      .filter(p => p.category === category)
      .slice(0, limit)
  }

  // Get complementary products (items that complete a look)
  static getComplementaryProducts(currentProduct: Product, limit: number = 3): Product[] {
    const complementaryCategories = this.getComplementaryCategories(currentProduct.category)
    
    return mockProducts
      .filter(p => 
        p.id !== currentProduct.id && 
        complementaryCategories.includes(p.category)
      )
      .slice(0, limit)
  }

  // Calculate similarity score between two products
  private static calculateSimilarityScore(product1: Product, product2: Product): number {
    let score = 0

    // Category match (highest weight)
    if (product1.category === product2.category) {
      score += 40
    }

    // Material overlap
    const materials1 = product1.materials || []
    const materials2 = product2.materials || []
    const materialOverlap = materials1.filter(m => materials2.includes(m)).length
    score += materialOverlap * 15

    // Price similarity (closer prices = higher score)
    const priceDiff = Math.abs(product1.price - product2.price)
    const priceScore = Math.max(0, 20 - (priceDiff / 10000))
    score += priceScore

    return score
  }

  // Calculate how well a product complements current cart contents
  private static calculateCartCompatibilityScore(
    product: Product, 
    cartCategories: Set<string>, 
    cartMaterials: Set<string>
  ): number {
    let score = 0

    // Complementary category bonus
    const complementaryCategories = Array.from(cartCategories).flatMap(cat => 
      this.getComplementaryCategories(cat)
    )
    if (complementaryCategories.includes(product.category)) {
      score += 30
    }

    // Material matching bonus
    const productMaterials = product.materials || []
    const materialMatches = productMaterials.filter(m => cartMaterials.has(m)).length
    score += materialMatches * 20

    // Featured product bonus
    if (product.featured) {
      score += 10
    }

    return score
  }

  // Get complementary categories for a given category
  private static getComplementaryCategories(category: string): string[] {
    const complementMap: Record<string, string[]> = {
      'rings': ['earrings', 'necklaces'],
      'earrings': ['rings', 'necklaces', 'bracelets'],
      'necklaces': ['earrings', 'bracelets'],
      'bracelets': ['earrings', 'necklaces', 'rings']
    }

    return complementMap[category] || []
  }

  // Helper method to get category from product ID (mock implementation)
  private static getCategoryFromProductId(productId: string): string {
    const product = mockProducts.find(p => p.id === productId)
    return product?.category || 'unknown'
  }

  // Helper method to get materials from product ID (mock implementation)
  private static getMaterialsFromProductId(productId: string): string[] {
    const product = mockProducts.find(p => p.id === productId)
    return product?.materials || []
  }
}

// Export mock products for use in components
export { mockProducts }

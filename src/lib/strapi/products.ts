import { Product } from '@/types/product'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

interface StrapiProduct {
  id: number
  documentId: string
  productId: string
  name: string
  slug: string
  price: number
  currency: string
  images?: any[]
  category: string
  sku?: string
  materials: string[]
  weight?: number
  dimensions?: string
  sizes: string[]
  gemstones: string[]
  inStock: boolean
  featured: boolean
  tags: string[]
  body: string
  originalCreatedAt?: string
  originalUpdatedAt?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

interface StrapiResponse {
  data: StrapiProduct[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface StrapiSingleResponse {
  data: StrapiProduct
}

function transformStrapiProduct(strapiProduct: StrapiProduct): Product {
  // Transform sizes from strings to SizeOption objects
  const transformedSizes = strapiProduct.sizes?.map(size => ({
    label: size,
    value: size
  })) || []
  
  // Transform gemstones from strings to GemstoneOption objects
  const transformedGemstones = strapiProduct.gemstones?.map(gemstone => ({
    name: gemstone,
    value: gemstone.toLowerCase().replace(/\s+/g, '-'),
    priceAdjustment: 0, // Default price adjustment
    available: true
  })) || []

  return {
    id: strapiProduct.productId,
    name: strapiProduct.name,
    slug: strapiProduct.slug,
    description: strapiProduct.body || '',
    price: strapiProduct.price,
    currency: strapiProduct.currency || 'LKR',
    images: strapiProduct.images?.map(img => img.url) || [], // TODO: Handle media properly
    category: strapiProduct.category,
    sku: strapiProduct.sku,
    materials: strapiProduct.materials || [],
    weight: strapiProduct.weight,
    dimensions: strapiProduct.dimensions,
    sizes: transformedSizes,
    gemstones: transformedGemstones,
    inStock: strapiProduct.inStock ?? true,
    featured: strapiProduct.featured ?? false,
    tags: strapiProduct.tags || [],
    createdAt: strapiProduct.originalCreatedAt || strapiProduct.createdAt,
    updatedAt: strapiProduct.originalUpdatedAt || strapiProduct.updatedAt,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?pagination[pageSize]=100`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.statusText)
      return []
    }
    
    const data: StrapiResponse = await response.json()
    return data.data.map(transformStrapiProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      return null
    }
    
    const data: StrapiResponse = await response.json()
    
    if (data.data.length === 0) {
      return null
    }
    
    return transformStrapiProduct(data.data[0])
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

export async function getProductsByCollection(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?filters[category][$eq]=${category}&pagination[pageSize]=100`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      console.error('Failed to fetch products for category:', category)
      return []
    }
    
    const data: StrapiResponse = await response.json()
    return data.data.map(transformStrapiProduct)
  } catch (error) {
    console.error('Error fetching products by collection:', error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?filters[featured][$eq]=true&pagination[pageSize]=10`, {
      next: { revalidate: 60 },
    })
    
    if (!response.ok) {
      return []
    }
    
    const data: StrapiResponse = await response.json()
    return data.data.map(transformStrapiProduct)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

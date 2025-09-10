import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Product, Collection } from '@/types/product'
import { 
  getProducts, 
  getProductBySlug as getStrapiProductBySlug,
  getProductsByCategory as getStrapiProductsByCategory,
  transformProductForLegacyCode 
} from '@/lib/strapi'

const contentDir = path.join(process.cwd(), 'src', 'data')

export function getAllCollections(): Collection[] {
  const file = path.join(contentDir, 'collections.json')
  if (!fs.existsSync(file)) return []
  const data = JSON.parse(fs.readFileSync(file, 'utf-8')) as Collection[]
  return data
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Try to get products from Strapi first
    const strapiProducts = await getProducts()
    if (strapiProducts.length > 0) {
      return strapiProducts.map(transformProductForLegacyCode)
    }
  } catch (error) {
    console.warn('Failed to fetch products from Strapi, falling back to local files:', error)
  }
  
  // Fallback to local markdown files if Strapi is not available
  const dir = path.join(contentDir, 'products')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  return files.map((filename) => {
    const filePath = path.join(dir, filename)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(file)
    return {
      id: String(data.id),
      slug: String(data.slug),
      name: String(data.name),
      description: content || String(data.description || ''),
      price: Number(data.price || 0),
      currency: data.currency || 'LKR',
      images: Array.isArray(data.images) ? data.images : [],
      category: String(data.category || 'uncategorized'),
      sku: data.sku || undefined,
      materials: Array.isArray(data.materials) ? data.materials : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      inStock: data.inStock ?? true,
      featured: data.featured ?? false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: data.createdAt || undefined,
      updatedAt: data.updatedAt || undefined,
    } as Product
  })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Try to get product from Strapi first
    const strapiProduct = await getStrapiProductBySlug(slug)
    if (strapiProduct) {
      return transformProductForLegacyCode(strapiProduct)
    }
  } catch (error) {
    console.warn(`Failed to fetch product ${slug} from Strapi, falling back to local files:`, error)
  }
  
  // Fallback to local search
  const allProducts = await getAllProducts()
  return allProducts.find((p) => p.slug === slug) || null
}

export async function getProductById(id: string): Promise<Product | null> {
  const allProducts = await getAllProducts()
  return allProducts.find((p) => p.id === id) || null
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  try {
    // Try to get products from Strapi first
    const strapiProducts = await getStrapiProductsByCategory(handle)
    if (strapiProducts.length > 0) {
      return strapiProducts.map(transformProductForLegacyCode)
    }
  } catch (error) {
    console.warn(`Failed to fetch products for category ${handle} from Strapi, falling back to local files:`, error)
  }
  
  // Fallback to local search
  const allProducts = await getAllProducts()
  return allProducts.filter((p) => p.category === handle)
}


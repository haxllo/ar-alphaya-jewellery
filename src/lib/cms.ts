import { cache } from 'react';
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Product as PayloadProduct, Media as PayloadMedia } from '@/payload-types'

// Types
export type Size = 'S' | 'M' | 'L' | 'XL';

export interface Gemstone {
  name: string;
  value: string;
  priceAdjustment?: number;
  description?: string;
  available?: boolean;
}

export interface Collection {
  name: string;
  handle: string;
  description?: string;
}

export interface MediaFile {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  category: string;
  sku?: string;
  materials?: string[];
  weight?: number;
  dimensions?: string;
  sizes?: Size[];
  gemstones?: Gemstone[];
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  availability?: string;
  leadTime?: string;
  customizable?: boolean;
  statusNote?: string;
}

export interface SiteSettings {
  id: number;
  title: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  collections: Collection[];
  createdAt: string;
  updatedAt: string;
}

// Helper functions
function normalizeProductFromPayload(doc: PayloadProduct): Product {
  const images = (doc.images || []).map(item => {
    if (typeof item.image === 'number') return '' // Should be populated
    return (item.image as PayloadMedia).url || ''
  }).filter(Boolean)

  // Extract text from Lexical RichText
  let description = ''
  try {
    if (doc.description && doc.description.root) {
        const root = doc.description.root;
        if (root.children) {
            description = root.children.map((child: any) => {
                if (child.children) {
                    return child.children.map((c: any) => c.text).join(' ')
                }
                return ''
            }).join('\n')
        }
    }
  } catch (e) {
    console.error('Error parsing description', e)
  }

  return {
    id: String(doc.id),
    productId: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description,
    price: doc.price,
    currency: doc.currency || 'LKR',
    images,
    category: doc.category,
    sku: doc.sku || undefined,
    materials: (doc.materials as string[]) || [],
    weight: doc.weight || undefined,
    dimensions: doc.dimensions || undefined,
    sizes: (doc.sizes as Size[]) || [],
    gemstones: (doc.gemstones || []).map(g => ({
      name: g.name,
      value: g.value,
      priceAdjustment: g.priceAdjustment || 0,
      description: g.description || undefined,
      available: g.available ?? true,
    })),
    inStock: doc.inStock ?? true,
    featured: doc.featured ?? false,
    tags: doc.tags || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    availability: doc.availability || undefined,
    leadTime: doc.leadTime || undefined,
    customizable: doc.customizable ?? false,
    statusNote: doc.statusNote || undefined,
  };
}

async function readProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        status: {
          equals: 'published',
        },
      },
      depth: 1,
      limit: 1000,
    })
    
    return docs.map(normalizeProductFromPayload)
  } catch (error) {
    console.error('Error in readProducts:', error)
    return []
  }
}

async function readSiteSettings(): Promise<SiteSettings | null> {
  // For now, return hardcoded settings
  // You can move this to a Supabase table later if needed
  return {
    id: 1,
    title: 'AR Alphaya Jewellery',
    description: 'Bespoke Sri Lankan Jewellery',
    email: 'info@aralphayajewellery.com',
    phone: '+94-77-429-3406',
    whatsapp: '+94774293406',
    address: 'Kandy, Sri Lanka',
    instagram: 'https://www.instagram.com/ar_alphaya_jewellery/',
    collections: [
      { name: 'Rings', handle: 'rings', description: '' },
      { name: 'Earrings', handle: 'earrings', description: '' },
      { name: 'Pendants', handle: 'pendants', description: '' },
      { name: 'Bracelets & Bangles', handle: 'bracelets-bangles', description: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Public API functions
export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return url;
  return url;
}

export function getOptimizedImageUrl(media: MediaFile | PayloadMedia, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'): string {
  // Handle Payload Media type
  if ('sizes' in media && 'url' in media && !('attributes' in media)) {
     const pm = media as PayloadMedia
     if (size === 'original') return getMediaUrl(pm.url)
     
     // Map size names: small->thumbnail, medium->card, large->tablet
     let targetSize: keyof NonNullable<PayloadMedia['sizes']> | undefined
     if (size === 'thumbnail') targetSize = 'thumbnail'
     else if (size === 'small') targetSize = 'thumbnail' 
     else if (size === 'medium') targetSize = 'card'
     else if (size === 'large') targetSize = 'tablet'
     
     if (targetSize && pm.sizes?.[targetSize]?.url) {
        return getMediaUrl(pm.sizes[targetSize]!.url)
     }
     return getMediaUrl(pm.url)
  }

  // Handle Legacy MediaFile type
  const legacy = media as MediaFile
  if (size === 'original') {
    return getMediaUrl(legacy.attributes.url);
  }
  
  const format = legacy.attributes.formats?.[size];
  return format ? getMediaUrl(format.url) : getMediaUrl(legacy.attributes.url);
}

export const getProducts = cache(async (options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<Product[]> => {
  const payload = await getPayload({ config })
  
  const where: any = {
      status: { equals: 'published' }
  }

  if (options?.category) {
      where.category = { equals: options.category }
  }
  if (options?.featured !== undefined) {
      where.featured = { equals: options.featured }
  }

  const { docs } = await payload.find({
      collection: 'products',
      where,
      limit: options?.limit || 1000,
      depth: 1,
      page: options?.page || 1,
  })

  return docs.map(normalizeProductFromPayload)
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
      collection: 'products',
      where: {
          slug: { equals: slug },
          status: { equals: 'published' }
      },
      limit: 1,
      depth: 1,
  })
  
  if (docs.length === 0) return null
  return normalizeProductFromPayload(docs[0])
});

export const getFeaturedProducts = cache(async (limit = 4): Promise<Product[]> => {
  return getProducts({ featured: true, limit });
});

export const getProductsByCategory = cache(async (
  category: string,
  limit?: number
): Promise<Product[]> => {
  return getProducts({ category, limit });
});

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return readSiteSettings();
});

export const getProductCategories = cache(async (): Promise<string[]> => {
  // Can be optimized with a specialized query or aggregation if needed
  const products = await getProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
});

export const getProductMaterials = cache(async (): Promise<string[]> => {
  const products = await getProducts();
  const materials = new Set<string>();
  
  products.forEach(p => {
    p.materials?.forEach(m => materials.add(m));
  });
  
  return Array.from(materials).sort();
});

export const getProductTags = cache(async (): Promise<string[]> => {
  const products = await getProducts();
  const tags = new Set<string>();
  
  products.forEach(p => {
    p.tags?.forEach(t => tags.add(t));
  });
  
  return Array.from(tags).sort();
});

export const getPriceRange = cache(async (): Promise<{ min: number; max: number }> => {
  const products = await getProducts();
  const prices = products.map(p => p.price);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  limit?: number;
  page?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const searchProducts = cache(async (filters: SearchFilters = {}): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    materials,
    inStock,
    featured,
    tags,
    limit = 20,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

  const payload = await getPayload({ config })
  const where: any = {
      status: { equals: 'published' }
  }

  // Text search (simple LIKE for now, can be improved)
  if (query) {
      where.or = [
          { name: { like: query } },
          // Description rich text structure makes direct like difficult, skipping for now or need specialized operator
          { sku: { like: query } }
      ]
  }

  if (category) where.category = { equals: category }
  
  if (minPrice !== undefined) where.price = { ...where.price, greater_than_equal: minPrice }
  if (maxPrice !== undefined) where.price = { ...where.price, less_than_equal: maxPrice }
  
  if (inStock !== undefined) where.inStock = { equals: inStock }
  if (featured !== undefined) where.featured = { equals: featured }

  if (materials && materials.length > 0) {
      where.materials = { in: materials }
  }

  // Tags not directly supported in 'in' operator if it's a text array, need to check Payload docs for array querying capabilities of the adapter
  // For now simple implementation:
  if (tags && tags.length > 0) {
     // This might need adjustment based on specific array querying capabilities of the adapter
  }

  const { docs, totalDocs, totalPages: payloadTotalPages } = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
      depth: 1
  })

  return {
    products: docs.map(normalizeProductFromPayload),
    total: totalDocs,
    page: page,
    totalPages: payloadTotalPages
  };
});

// Legacy function for backward compatibility
export const searchProductsLegacy = cache(async (query: string, limit = 20): Promise<Product[]> => {
  const result = await searchProducts({ query, limit });
  return result.products;
});

export async function getProductStaticPaths(): Promise<Array<{ params: { slug: string } }>> {
  const products = await getProducts();
  return products.map(product => ({
    params: { slug: product.slug },
  }));
}
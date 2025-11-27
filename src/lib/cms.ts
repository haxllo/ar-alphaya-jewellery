import { cache } from 'react';
import { createServerClient } from '@/lib/supabase';

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
function normalizeProductFromDb(raw: any): Product {
  return {
    id: raw.id,
    productId: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    price: Number(raw.price) || 0,
    currency: raw.currency || 'LKR',
    images: raw.images || [],
    category: raw.category || 'rings',
    sku: raw.sku,
    materials: raw.materials,
    weight: raw.weight ? Number(raw.weight) : undefined,
    dimensions: raw.dimensions,
    sizes: raw.sizes,
    gemstones: raw.gemstones,
    inStock: raw.in_stock ?? true,
    featured: raw.featured ?? false,
    tags: raw.tags,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    availability: raw.availability,
    leadTime: raw.lead_time,
    customizable: raw.customizable ?? false,
    statusNote: raw.status_note,
  };
}

async function readProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products from Supabase:', error)
      return []
    }
    
    return (products || []).map(normalizeProductFromDb)
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
    email: 'contact@aralphayajewellery.com',
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

export function getOptimizedImageUrl(media: MediaFile, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'): string {
  if (size === 'original') {
    return getMediaUrl(media.attributes.url);
  }
  
  const format = media.attributes.formats?.[size];
  return format ? getMediaUrl(format.url) : getMediaUrl(media.attributes.url);
}

export const getProducts = cache(async (options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<Product[]> => {
  const all = await readProducts();
  let filtered = all;
  
  if (options?.category) filtered = filtered.filter(p => p.category === options.category);
  if (options?.featured !== undefined) filtered = filtered.filter(p => p.featured === options.featured);
  if (options?.limit) filtered = filtered.slice(0, options.limit);
  
  return filtered;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const all = await readProducts();
  return all.find(p => p.slug === slug) || null;
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

  const all = await readProducts();
  let filtered = [...all];

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm) ||
      p.materials?.some(m => m.toLowerCase().includes(searchTerm)) ||
      p.tags?.some(t => t.toLowerCase().includes(searchTerm)) ||
      p.gemstones?.some(g => g.name.toLowerCase().includes(searchTerm))
    );
  }

  // Category filter
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  // Price range filter
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Materials filter
  if (materials && materials.length > 0) {
    filtered = filtered.filter(p => 
      p.materials?.some(m => materials.some(filterMaterial => 
        m.toLowerCase().includes(filterMaterial.toLowerCase())
      ))
    );
  }

  // Stock filter
  if (inStock !== undefined) {
    filtered = filtered.filter(p => p.inStock === inStock);
  }

  // Featured filter
  if (featured !== undefined) {
    filtered = filtered.filter(p => p.featured === featured);
  }

  // Tags filter
  if (tags && tags.length > 0) {
    filtered = filtered.filter(p => 
      p.tags?.some(t => tags.some(filterTag => 
        t.toLowerCase().includes(filterTag.toLowerCase())
      ))
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total,
    page,
    totalPages
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

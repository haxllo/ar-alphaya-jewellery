import { cache } from 'react';

// Strapi configuration
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN; // Server-side only for sensitive operations

// Types matching Strapi API response structure
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  } | null;
}

interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface MediaFile {
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

// Product types
export interface Size {
  label: string;
  value: string;
}

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

export interface Product {
  id: number;
  productId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  images: MediaFile[];
  category: 'rings' | 'earrings' | 'pendants' | 'bracelets-bangles';
  sku?: string;
  materials?: string[];
  weight?: number;
  dimensions?: string;
  sizes?: Size[];
  gemstones?: Gemstone[];
  inStock: boolean;
  featured: boolean;
  tags?: string[];
  body: string;
  originalCreatedAt?: string;
  originalUpdatedAt?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
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

/**
 * Generic function to fetch from Strapi API
 */
export async function strapiFetch(
  path: string,
  init?: RequestInit,
  useToken = false
): Promise<any> {
  const url = `${STRAPI_URL}/api${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...init?.headers,
  };

  if (useToken && STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strapi API error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Convert Strapi media URL to absolute URL
 */
export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Get optimized image URL from Strapi media formats
 */
export function getOptimizedImageUrl(media: MediaFile, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'): string {
  if (size === 'original') {
    return getMediaUrl(media.attributes.url);
  }
  
  const format = media.attributes.formats?.[size];
  return format ? getMediaUrl(format.url) : getMediaUrl(media.attributes.url);
}

/**
 * Cached function to get all products
 */
export const getProducts = cache(async (options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  // Add filters
  if (options?.category) {
    params.append('filters[category][$eq]', options.category);
  }
  if (options?.featured !== undefined) {
    params.append('filters[featured][$eq]', options.featured.toString());
  }
  
  // Add pagination
  if (options?.limit) {
    params.append('pagination[pageSize]', options.limit.toString());
  }
  if (options?.page) {
    params.append('pagination[page]', options.page.toString());
  }
  
  // Always populate images and sort by creation date
  params.append('populate', 'images,sizes,gemstones');
  params.append('sort', 'createdAt:desc');

  const path = `/products?${params.toString()}`;
  const response: StrapiCollectionResponse<Product> = await strapiFetch(path);
  
  return response.data.map(item => ({
    id: item.id,
    ...item.attributes,
  }));
});

/**
 * Cached function to get a single product by slug
 */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const params = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': 'images,sizes,gemstones',
    'pagination[limit]': '1',
  });

  const path = `/products?${params.toString()}`;
  const response: StrapiCollectionResponse<Product> = await strapiFetch(path);
  
  if (!response.data.length) {
    return null;
  }

  const item = response.data[0];
  return {
    id: item.id,
    ...item.attributes,
  };
});

/**
 * Cached function to get featured products
 */
export const getFeaturedProducts = cache(async (limit = 4): Promise<Product[]> => {
  return getProducts({ featured: true, limit });
});

/**
 * Cached function to get products by category
 */
export const getProductsByCategory = cache(async (
  category: string,
  limit?: number
): Promise<Product[]> => {
  return getProducts({ category, limit });
});

/**
 * Cached function to get site settings
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const path = '/site-setting?populate=collections';
  const response: StrapiSingleResponse<SiteSettings> = await strapiFetch(path);
  
  if (!response.data) {
    return null;
  }

  return {
    id: response.data.id,
    ...response.data.attributes,
  };
});

/**
 * Get all unique product categories
 */
export const getProductCategories = cache(async (): Promise<string[]> => {
  const products = await getProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
});

/**
 * Search products by name or description
 */
export const searchProducts = cache(async (query: string, limit = 20): Promise<Product[]> => {
  const params = new URLSearchParams({
    'filters[$or][0][name][$containsi]': query,
    'filters[$or][1][body][$containsi]': query,
    'populate': 'images,sizes,gemstones',
    'pagination[limit]': limit.toString(),
    'sort': 'createdAt:desc',
  });

  const path = `/products?${params.toString()}`;
  const response: StrapiCollectionResponse<Product> = await strapiFetch(path);
  
  return response.data.map(item => ({
    id: item.id,
    ...item.attributes,
  }));
});

/**
 * Get static paths for product pages (for static generation)
 */
export async function getProductStaticPaths(): Promise<Array<{ params: { slug: string } }>> {
  const products = await getProducts();
  return products.map(product => ({
    params: { slug: product.slug },
  }));
}

/**
 * Helper function to transform product data for compatibility with existing code
 */
export function transformProductForLegacyCode(product: Product): any {
  return {
    id: product.productId,
    slug: product.slug,
    name: product.name,
    price: product.price,
    currency: product.currency,
    images: product.images.map(img => getMediaUrl(img.attributes.url)),
    category: product.category,
    sku: product.sku,
    materials: product.materials,
    weight: product.weight,
    dimensions: product.dimensions,
    sizes: product.sizes,
    gemstones: product.gemstones,
    inStock: product.inStock,
    featured: product.featured,
    tags: product.tags,
    description: product.body,
    createdAt: product.originalCreatedAt || product.createdAt,
    updatedAt: product.originalUpdatedAt || product.updatedAt,
  };
}

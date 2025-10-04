import { cache } from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';
import { validateProduct } from '@/lib/validation';

// Types
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

// File paths
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');
const SETTINGS_FILE = path.join(process.cwd(), 'public', 'admin', 'site-settings.json');

// Helper functions
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function normalizeProductAttributes(raw: any, id?: string): Product {
  const coercedGemstones = Array.isArray(raw.gemstones)
    ? raw.gemstones.map((g: any) => ({
        name: g?.name ?? '',
        value: g?.value ?? '',
        priceAdjustment: g?.priceAdjustment !== undefined && g?.priceAdjustment !== null
          ? Number(g.priceAdjustment)
          : 0,
        description: g?.description,
        available: g?.available ?? true,
      }))
    : undefined;

  return {
    id: id ?? raw.id ?? raw.productId ?? raw.slug,
    productId: raw.productId ?? raw.slug ?? raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.body ?? raw.description ?? '',
    price: raw.price !== undefined && raw.price !== null ? Number(raw.price) : 0,
    currency: raw.currency ?? 'LKR',
    images: raw.images || [],
    category: raw.category ?? 'rings',
    sku: raw.sku,
    materials: raw.materials,
    weight: raw.weight !== undefined && raw.weight !== null ? Number(raw.weight) : undefined,
    dimensions: raw.dimensions,
    sizes: raw.sizes,
    gemstones: coercedGemstones,
    inStock: raw.inStock ?? true,
    featured: raw.featured ?? false,
    tags: raw.tags,
    createdAt: raw.createdAt ?? raw.originalCreatedAt,
    updatedAt: raw.updatedAt ?? raw.originalUpdatedAt,
    availability: raw.availability,
    leadTime: raw.leadTime,
    customizable: raw.customizable ?? false,
    statusNote: raw.statusNote,
  };
}

async function readProducts(): Promise<Product[]> {
  try {
    const entries = await fs.readdir(PRODUCTS_DIR, { withFileTypes: true });
    const productFiles = entries.filter(e => e.isFile() && e.name.toLowerCase().endsWith('.json'));
    const productsRaw = await Promise.all(
      productFiles.map(async f => readJsonFile<any>(path.join(PRODUCTS_DIR, f.name)))
    );

    const products: Product[] = (productsRaw.filter(Boolean) as any[])
      .filter((raw, i) => {
        // Basic validation; skip invalid entries but continue
        try {
          // Map raw into a minimal object for validation (before normalization)
          validateProduct({
            name: raw?.name ?? '',
            slug: raw?.slug ?? '',
            price: Number(raw?.price ?? 0),
            currency: (raw?.currency ?? 'LKR'),
            category: raw?.category ?? 'rings',
            images: Array.isArray(raw?.images) && raw.images.length > 0 ? raw.images.map((x:any)=> (typeof x === 'string' ? x : (typeof x?.image === 'string' ? x.image : ''))).filter(Boolean) : ['https://via.placeholder.com/600'],
          })
          return true
        } catch (e) {
          console.warn('Skipping invalid product entry at index', i)
          return false
        }
      })
      .map((raw, index) => {
      // Normalize images to an array of URL strings
      const coerceToString = (value: any): string | undefined => {
        if (!value) return undefined;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
          const first = value.find(v => typeof v === 'string');
          return typeof first === 'string' ? first : undefined;
        }
        return undefined;
      };

      const imageList: string[] = Array.isArray(raw.images)
        ? raw.images
            .map((img: any) => {
              if (typeof img === 'string') return img;
              if (img && typeof img === 'object') {
                // Support { image: string } or { image: [string] }
                const maybe = coerceToString(img.image);
                return maybe;
              }
              return undefined;
            })
            .filter((u: any): u is string => typeof u === 'string')
        : [];

      const mediaFiles = imageList.map((url, i) => ({
        id: i + 1,
        attributes: {
          name: path.basename(url || ''),
          alternativeText: undefined,
          caption: undefined,
          width: 0,
          height: 0,
          formats: undefined,
          url,
          previewUrl: undefined,
          provider: 'decap',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }));

      return {
        id: String(index + 1),
        productId: raw.productId || raw.slug || String(index + 1),
        name: raw.name || '',
        slug: raw.slug || (raw.name ? raw.name.toLowerCase().replace(/\s+/g, '-') : `product-${index + 1}`),
        price: raw.price ? Number(raw.price) : 0,
        currency: raw.currency || 'LKR',
        images: mediaFiles.map(file => file.attributes.url),
        category: raw.category || 'rings',
        sku: raw.sku,
        materials: raw.materials,
        weight: raw.weight !== undefined && raw.weight !== null ? Number(raw.weight) : undefined,
        dimensions: raw.dimensions,
        sizes: raw.sizes,
        gemstones: Array.isArray(raw.gemstones)
          ? raw.gemstones.map((g: any) => ({
              name: g?.name ?? '',
              value: g?.value ?? '',
              priceAdjustment: g?.priceAdjustment != null ? Number(g.priceAdjustment) : undefined,
              description: g?.description,
              available: g?.available,
            }))
          : undefined,
        inStock: Boolean(raw.inStock ?? true),
        featured: Boolean(raw.featured ?? false),
        tags: raw.tags,
        description: raw.body || raw.description || '',
        originalCreatedAt: raw.createdAt,
        originalUpdatedAt: raw.updatedAt,
        publishedAt: new Date().toISOString(),
        createdAt: raw.createdAt || new Date().toISOString(),
        updatedAt: raw.updatedAt || new Date().toISOString(),
        availability: raw.availability,
        leadTime: raw.leadTime,
        customizable: raw.customizable ?? false,
        statusNote: raw.statusNote,
      } as Product;
    });

    return products.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

async function readSiteSettings(): Promise<SiteSettings | null> {
  const raw = await readJsonFile<any>(SETTINGS_FILE);
  if (!raw) return null;
  return {
    id: 1,
    title: raw.title || '',
    description: raw.description || '',
    email: raw.email || '',
    phone: raw.phone || '',
    whatsapp: raw.whatsapp || '',
    address: raw.address || '',
    instagram: raw.instagram || '',
    collections: Array.isArray(raw.collections) ? raw.collections : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as SiteSettings;
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

export function transformProductForLegacyCode(product: Product): any {
  return {
    id: product.productId,
    slug: product.slug,
    name: product.name,
    price: product.price,
    currency: product.currency,
    images: product.images.map(img => getMediaUrl(img)),
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
    description: product.description,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

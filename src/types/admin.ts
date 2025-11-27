// Admin Panel Types for AR Alphaya Jewellery

export interface Product {
  id: string
  product_id: string
  name: string
  slug: string
  description: string | null
  cardDescription?: string | null
  price: number
  currency: string
  images: string[]
  category: string
  sku: string | null
  materials: string[] | null
  weight: number | string | null
  dimensions: string | null
  sizes: Size[] | null
  gemstones: Gemstone[] | null
  plating: PlatingOption[] | null
  in_stock: boolean
  featured: boolean
  status: 'draft' | 'published'
  availability: string | null
  lead_time: string | null
  customizable: boolean
  status_note: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export type Size = 'S' | 'M' | 'L' | 'XL'

export interface Gemstone {
  name: string
  value: string
  priceAdjustment?: number
  description?: string
  available?: boolean
}

export interface PlatingOption {
  type: '925-silver' | '24k-gold' | '18k-rose-gold'
  label: string
  priceAdjustment: number
  available: boolean
}

export interface ProductFormData {
  name: string
  slug: string
  description: string
  cardDescription?: string
  price: number
  currency: string
  images: string[]
  category: string
  sku: string
  materials: string[]
  weight: number | string | null
  dimensions: string
  sizes: Size[]
  gemstones: Gemstone[]
  plating: PlatingOption[]
  in_stock: boolean
  featured: boolean
  status: 'draft' | 'published'
  availability: string
  lead_time: string
  customizable: boolean
  status_note: string
}

export interface ProductFilters {
  search?: string
  category?: string
  status?: 'draft' | 'published'
  featured?: boolean
  in_stock?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  active: boolean
  created_at: string
}

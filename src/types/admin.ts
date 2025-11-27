// Admin Panel Types for AR Alphaya Jewellery

export interface Product {
  id: string
  product_id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  images: string[]
  category: string
  sku: string | null
  materials: string[] | null
  tags: string[] | null
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

export interface Size {
  label: string
  value: string
}

export interface Gemstone {
  name: string
  value: string
  priceAdjustment?: number
  description?: string
  available?: boolean
}

export interface PlatingOption {
  type: 'Gold' | 'Rose Gold' | 'Silver' | 'Rhodium' | 'Platinum' | 'Two-Tone' | 'Unplated'
  priceAdjustment?: number
  available?: boolean
}

export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  currency: string
  images: string[]
  category: string
  sku: string
  materials: string[]
  tags: string[]
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

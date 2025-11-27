import { createServerClient } from '@/lib/supabase'
import type { Product, ProductFilters, ProductFormData, ProductListResponse } from '@/types/admin'
import { validateProductData, validateProductUpdate } from './validation'
import { ITEMS_PER_PAGE } from './constants'

/**
 * Get paginated list of products with filters
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  const supabase = createServerClient()
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
  
  // Apply search filter
  if (filters.search) {
    const searchTerm = `%${filters.search}%`
    query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},sku.ilike.${searchTerm}`)
  }
  
  // Apply category filter
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  // Apply status filter
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  
  // Apply featured filter
  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }
  
  // Apply in_stock filter
  if (filters.in_stock !== undefined) {
    query = query.eq('in_stock', filters.in_stock)
  }
  
  // Sorting
  const sortBy = filters.sortBy || 'created_at'
  const sortOrder = filters.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  
  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || ITEMS_PER_PAGE
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  query = query.range(from, to)
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  
  return {
    products: (data || []) as Product[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching product:', error)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
  
  if (!data) {
    throw new Error('Product not found')
  }
  
  return data as Product
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return null
    }
    console.error('Error fetching product by slug:', error)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
  
  return data as Product
}

/**
 * Create new product
 */
export async function createProduct(
  formData: ProductFormData,
  userId: string
): Promise<Product> {
  const supabase = createServerClient()
  
  // Validate data
  const validated = validateProductData(formData)
  
  // Generate product_id
  const product_id = `PROD-${Date.now()}`
  
  // Check if slug is unique
  const existingProduct = await getProductBySlug(validated.slug)
  if (existingProduct) {
    throw new Error('A product with this slug already exists')
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      product_id,
      ...validated,
      created_by: userId,
      updated_by: userId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating product:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }
  
  return data as Product
}

/**
 * Update existing product
 */
export async function updateProduct(
  id: string,
  formData: Partial<ProductFormData>,
  userId: string
): Promise<Product> {
  const supabase = createServerClient()
  
  // Validate data
  const validated = validateProductUpdate(formData)
  
  // If slug is being updated, check uniqueness
  if (validated.slug) {
    const existingProduct = await getProductBySlug(validated.slug)
    if (existingProduct && existingProduct.id !== id) {
      throw new Error('A product with this slug already exists')
    }
  }
  
  const { data, error } = await supabase
    .from('products')
    .update({
      ...validated,
      updated_by: userId
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating product:', error)
    throw new Error(`Failed to update product: ${error.message}`)
  }
  
  if (!data) {
    throw new Error('Product not found')
  }
  
  return data as Product
}

/**
 * Delete product
 */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = createServerClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw new Error(`Failed to delete product: ${error.message}`)
  }
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  const supabase = createServerClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', ids)
  
  if (error) {
    console.error('Error bulk deleting products:', error)
    throw new Error(`Failed to delete products: ${error.message}`)
  }
}

/**
 * Bulk update product status
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: 'draft' | 'published',
  userId: string
): Promise<void> {
  const supabase = createServerClient()
  
  const { error } = await supabase
    .from('products')
    .update({ status, updated_by: userId })
    .in('id', ids)
  
  if (error) {
    console.error('Error bulk updating status:', error)
    throw new Error(`Failed to update status: ${error.message}`)
  }
}

/**
 * Duplicate product
 */
export async function duplicateProduct(id: string, userId: string): Promise<Product> {
  const original = await getProductById(id)
  
  const timestamp = Date.now()
  const newProduct: ProductFormData = {
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${timestamp}`,
    description: original.description || '',
    price: original.price,
    currency: original.currency,
    images: original.images,
    category: original.category,
    sku: original.sku ? `${original.sku}-COPY` : '',
    materials: original.materials || [],
    tags: original.tags || [],
    weight: original.weight,
    dimensions: original.dimensions || '',
    sizes: original.sizes || [],
    gemstones: original.gemstones || [],
    plating: original.plating || [],
    in_stock: original.in_stock,
    featured: false, // Don't duplicate featured status
    status: 'draft', // Always start as draft
    availability: original.availability || '',
    lead_time: original.lead_time || '',
    customizable: original.customizable,
    status_note: original.status_note || ''
  }
  
  return createProduct(newProduct, userId)
}

/**
 * Check if slug is available
 */
export async function checkSlugAvailability(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = createServerClient()
  
  let query = supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .limit(1)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error checking slug availability:', error)
    return false
  }
  
  return !data || data.length === 0
}

/**
 * Get product statistics
 */
export async function getProductStats(): Promise<{
  total: number
  published: number
  draft: number
  featured: number
  outOfStock: number
}> {
  const supabase = createServerClient()
  
  const [
    { count: total },
    { count: published },
    { count: draft },
    { count: featured },
    { count: outOfStock }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false)
  ])
  
  return {
    total: total || 0,
    published: published || 0,
    draft: draft || 0,
    featured: featured || 0,
    outOfStock: outOfStock || 0
  }
}

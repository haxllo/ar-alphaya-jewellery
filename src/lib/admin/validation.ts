import { z } from 'zod'

export const sizeSchema = z.object({
  label: z.string().min(1, 'Size label is required'),
  value: z.string().min(1, 'Size value is required')
})

export const gemstoneSchema = z.object({
  name: z.string().min(1, 'Gemstone name is required'),
  value: z.string().min(1, 'Gemstone value is required'),
  priceAdjustment: z.number().optional(),
  description: z.string().optional(),
  available: z.boolean().optional().default(true)
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Name too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  currency: z.string().default('LKR'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().max(100, 'SKU too long').optional().nullable(),
  materials: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  weight: z.union([z.number().min(0, 'Weight must be positive'), z.string().max(50, 'Weight too long')]).optional().nullable(),
  dimensions: z.string().max(255, 'Dimensions too long').optional().nullable(),
  sizes: z.array(sizeSchema).optional().nullable(),
  gemstones: z.array(gemstoneSchema).optional().nullable(),
  in_stock: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  availability: z.string().max(100, 'Availability text too long').optional().nullable(),
  lead_time: z.string().max(100, 'Lead time too long').optional().nullable(),
  customizable: z.boolean().default(false),
  status_note: z.string().optional().nullable()
})

export type ProductFormData = z.infer<typeof productSchema>

// Validate and sanitize input
export function validateProductData(data: unknown): ProductFormData {
  return productSchema.parse(data)
}

// Partial validation for updates
export function validateProductUpdate(data: unknown): Partial<ProductFormData> {
  return productSchema.partial().parse(data)
}

// Generate slug from name
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

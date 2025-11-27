import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Product name contains invalid characters'),
  
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9\-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  
  price: z.number()
    .positive('Price must be positive')
    .max(1000000, 'Price must be less than 1,000,000'),
  
  currency: z.enum(['LKR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SEK', 'CHF', 'JPY']),
  
  category: z.enum(['rings', 'earrings', 'pendants', 'bracelets-bangles']),
  
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  
  sku: z.string().max(50, 'SKU must be less than 50 characters').optional(),
  
  materials: z.array(z.string().max(50, 'Material name too long')).optional(),
  
  weight: z.number().positive('Weight must be positive').max(1000, 'Weight must be less than 1000g').optional(),
  
  dimensions: z.string().max(100, 'Dimensions description too long').optional(),
  
  sizes: z.array(z.object({
    label: z.string().min(1, 'Size label is required').max(20, 'Size label too long'),
    value: z.string().min(1, 'Size value is required').max(20, 'Size value too long'),
  })).optional(),
  
  gemstones: z.array(z.object({
    name: z.string().min(1, 'Gemstone name is required').max(50, 'Gemstone name too long'),
    value: z.string().min(1, 'Gemstone value is required').max(50, 'Gemstone value too long'),
    priceAdjustment: z.number().optional(),
    description: z.string().max(200, 'Description too long').optional(),
    available: z.boolean().optional(),
  })).optional(),
  
  plating: z.array(z.object({
    type: z.enum(['Gold', 'Rose Gold', 'Silver', 'Rhodium', 'Platinum', 'Two-Tone', 'Unplated']),
    priceAdjustment: z.number().optional(),
    available: z.boolean().optional().default(true),
  })).optional(),
  
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().max(30, 'Tag too long')).optional(),
  body: z.string().max(5000, 'Description too long').optional(),
});

// User input validation schema
export const userInputSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
  message: z.string().max(1000, 'Message too long').optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  budget: z.string().max(100, 'Budget description too long').optional(),
});

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.array(z.enum(['new-products', 'sales', 'updates'])).optional(),
});

// Cart item validation
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity too high'),
  size: z.string().max(20, 'Size too long').optional(),
  gemstone: z.string().max(50, 'Gemstone name too long').optional(),
});

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
});

// Advanced search filters validation
export const searchFiltersSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  category: z.enum(['rings', 'earrings', 'pendants', 'bracelets-bangles']).optional(),
  minPrice: z.number().min(0, 'Min price must be positive').optional(),
  maxPrice: z.number().min(0, 'Max price must be positive').optional(),
  materials: z.array(z.string().max(50, 'Material name too long')).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().max(30, 'Tag too long')).optional(),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit too high').optional(),
  page: z.number().int().min(1, 'Page must be at least 1').optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: 'Min price must be less than or equal to max price',
    path: ['minPrice'],
  }
);

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

// Validation helper functions
export function validateProduct(data: unknown) {
  try {
    return productSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateUserInput(data: unknown) {
  try {
    return userInputSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateContactForm(data: unknown) {
  try {
    return contactFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateNewsletter(data: unknown) {
  try {
    return newsletterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateCartItem(data: unknown) {
  try {
    return cartItemSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateSearchQuery(data: unknown) {
  try {
    return searchQuerySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateSearchRequest(data: unknown) {
  try {
    const result = searchFiltersSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      };
    }
    return { 
      success: false, 
      errors: [{ field: 'general', message: 'Validation failed' }]
    };
  }
}

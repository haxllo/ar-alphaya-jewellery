import { useState, useCallback } from 'react'
import type { ProductFormData } from '@/types/admin'

interface ValidationErrors {
  name?: string
  slug?: string
  price?: string
  images?: string
  category?: string
  weight?: string
  dimensions?: string
  sku?: string
  description?: string
  availability?: string
  lead_time?: string
}

export function useProductValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback((field: keyof ProductFormData, value: any): string | undefined => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'Product name is required'
        }
        if (value.length > 255) {
          return 'Product name must be less than 255 characters'
        }
        break

      case 'slug':
        if (!value || value.trim().length === 0) {
          return 'URL slug is required'
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        if (value.length > 255) {
          return 'Slug must be less than 255 characters'
        }
        break

      case 'price':
        if (value === null || value === undefined || value === '') {
          return 'Price is required'
        }
        if (isNaN(Number(value)) || Number(value) < 0) {
          return 'Price must be 0 or greater'
        }
        break

      case 'images':
        if (!value || !Array.isArray(value) || value.length === 0) {
          return 'At least one product image is required'
        }
        // Validate each image URL
        for (const img of value) {
          try {
            new URL(img)
          } catch {
            return 'All images must be valid URLs'
          }
        }
        break

      case 'category':
        if (!value || value.trim().length === 0) {
          return 'Category is required'
        }
        break

      case 'weight':
        if (value !== null && value !== undefined && value !== '') {
          // Allow strings like "5.5g" or "2.3 grams" - just check max length
          if (typeof value === 'string' && value.length > 50) {
            return 'Weight must be less than 50 characters'
          }
          // If it's a number, validate it's positive
          if (typeof value === 'number' && value < 0) {
            return 'Weight must be a positive number'
          }
        }
        break

      case 'sku':
        if (value && value.length > 100) {
          return 'SKU must be less than 100 characters'
        }
        break

      case 'description':
        if (value && value.length > 5000) {
          return 'Description must be less than 5000 characters'
        }
        break

      case 'dimensions':
        if (value && value.length > 255) {
          return 'Dimensions must be less than 255 characters'
        }
        break

      case 'availability':
        if (value && value.length > 100) {
          return 'Availability text must be less than 100 characters'
        }
        break

      case 'lead_time':
        if (value && value.length > 100) {
          return 'Lead time must be less than 100 characters'
        }
        break
    }

    return undefined
  }, [])

  const validateForm = useCallback((formData: Partial<ProductFormData>): boolean => {
    const newErrors: ValidationErrors = {}

    // Validate required fields
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError

    const slugError = validateField('slug', formData.slug)
    if (slugError) newErrors.slug = slugError

    const priceError = validateField('price', formData.price)
    if (priceError) newErrors.price = priceError

    const imagesError = validateField('images', formData.images)
    if (imagesError) newErrors.images = imagesError

    const categoryError = validateField('category', formData.category)
    if (categoryError) newErrors.category = categoryError

    // Validate optional fields if they have values
    if (formData.weight !== null && formData.weight !== undefined) {
      const weightError = validateField('weight', formData.weight)
      if (weightError) newErrors.weight = weightError
    }

    if (formData.sku) {
      const skuError = validateField('sku', formData.sku)
      if (skuError) newErrors.sku = skuError
    }

    if (formData.description) {
      const descError = validateField('description', formData.description)
      if (descError) newErrors.description = descError
    }

    if (formData.dimensions) {
      const dimError = validateField('dimensions', formData.dimensions)
      if (dimError) newErrors.dimensions = dimError
    }

    if (formData.availability) {
      const availError = validateField('availability', formData.availability)
      if (availError) newErrors.availability = availError
    }

    if (formData.lead_time) {
      const leadError = validateField('lead_time', formData.lead_time)
      if (leadError) newErrors.lead_time = leadError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [validateField])

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const setFieldError = useCallback((field: keyof ValidationErrors, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }, [])

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    setFieldError,
    setErrors
  }
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { CheckboxGrid } from '@/components/admin/CheckboxGrid'
import { PRODUCT_CATEGORIES, MATERIALS, COMMON_TAGS, AVAILABILITY_OPTIONS, GEMSTONE_TYPES, PLATING_TYPES } from '@/lib/admin/constants'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useProductValidation } from '@/hooks/useProductValidation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Product, Size, Gemstone, PlatingOption } from '@/types/admin'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const { errors, validateForm, validateField, clearError, setFieldError } = useProductValidation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Partial<Product>>({})
  const [productId, setProductId] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Resolve params promise and fetch product
    params.then(({ id }) => {
      setProductId(id)
      fetchProduct(id)
    })
  }, [])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFieldBlur = (field: keyof Product, value: any) => {
    const error = validateField(field as any, value)
    if (error) {
      setFieldError(field as any, error)
    } else {
      clearError(field as any)
    }
  }

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!productId) return

    // Prepare data for validation - convert null to undefined
    const dataToValidate = {
      ...product,
      description: product.description ?? undefined,
      sku: product.sku ?? undefined,
      materials: product.materials ?? undefined,
      tags: product.tags ?? undefined,
      weight: product.weight ?? undefined,
      dimensions: product.dimensions ?? undefined,
      sizes: product.sizes ?? undefined,
      gemstones: product.gemstones ?? undefined,
      availability: product.availability ?? undefined,
      lead_time: product.lead_time ?? undefined,
      status_note: product.status_note ?? undefined,
    }

    // Validate form before submission
    const isValid = validateForm(dataToValidate)
    
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix all errors before saving the product.",
      })
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-500')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setSaving(true)

    try {
      const updateData = { ...product }
      if (status) {
        updateData.status = status
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      toast({
        variant: "success",
        title: "Product Updated!",
        description: updateData.status === 'published' 
          ? "Product is now published and visible on website"
          : "Product saved successfully",
      })
      
      setTimeout(() => router.push('/admin/products'), 1000)
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save product',
      })
      setSaving(false)
    }
  }

  const confirmDelete = () => {
    if (!productId) return
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productId) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast({
        variant: "success",
        title: "Product Deleted!",
        description: "Product has been permanently deleted",
      })

      setTimeout(() => router.push('/admin/products'), 1000)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 h-11 sm:h-10">
              <ArrowLeft className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              Back to Products
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Product</h1>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto h-11 sm:h-auto"
              onClick={confirmDelete}
            >
              <Trash2 className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              Delete Product
            </Button>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-0">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => {
                    setProduct(prev => ({ ...prev, name: e.target.value }))
                    clearError('name')
                  }}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={product.slug}
                  onChange={(e) => {
                    setProduct(prev => ({ ...prev, slug: e.target.value }))
                    clearError('slug')
                  }}
                  onBlur={(e) => handleFieldBlur('slug', e.target.value)}
                  className={errors.slug ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.slug && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.slug}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description || ''}
                  onChange={(e) => {
                    setProduct(prev => ({ ...prev, description: e.target.value }))
                    clearError('description')
                  }}
                  onBlur={(e) => handleFieldBlur('description', e.target.value)}
                  className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  rows={6}
                />
                {errors.description && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className={`flex h-10 w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm`}
                    value={product.category}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, category: e.target.value }))
                      clearError('category')
                    }}
                    onBlur={(e) => handleFieldBlur('category', e.target.value)}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={product.sku || ''}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, sku: e.target.value }))
                      clearError('sku')
                    }}
                    onBlur={(e) => handleFieldBlur('sku', e.target.value)}
                    className={errors.sku ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.sku && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.sku}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={product.price}
                  onChange={(e) => {
                    setProduct(prev => ({ ...prev, price: Number(e.target.value) }))
                    clearError('price')
                  }}
                  onBlur={(e) => handleFieldBlur('price', Number(e.target.value))}
                  min="0"
                  className={errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.price && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.price}</span>
                  </div>
                )}
              </div>
              <div>
                <Label>Currency</Label>
                <Input value="LKR" disabled />
              </div>
            </div>
          </div>

          {/* Materials & Physical Details */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Materials & Physical Details</h2>
            <div className="space-y-4">
              <CheckboxGrid
                label="Materials"
                options={MATERIALS}
                selected={product.materials || []}
                onChange={(materials) => setProduct(prev => ({ ...prev, materials }))}
                columns={4}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    type="text"
                    value={product.weight || ''}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, weight: e.target.value || null }))
                      clearError('weight')
                    }}
                    onBlur={(e) => handleFieldBlur('weight', e.target.value)}
                    placeholder="e.g., 5.25g or 2.3 grams"
                    className={errors.weight ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.weight && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.weight}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={product.dimensions || ''}
                    onChange={(e) => {
                      setProduct(prev => ({ ...prev, dimensions: e.target.value }))
                      clearError('dimensions')
                    }}
                    onBlur={(e) => handleFieldBlur('dimensions', e.target.value)}
                    placeholder="e.g., 20mm x 15mm"
                    className={errors.dimensions ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.dimensions && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>

              <CheckboxGrid
                label="Tags"
                options={COMMON_TAGS}
                selected={product.tags || []}
                onChange={(tags) => setProduct(prev => ({ ...prev, tags }))}
                columns={3}
              />
            </div>
          </div>

          {/* Plating Options Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Plating Options</h2>
            <p className="text-sm text-gray-600 mb-4">Select plating finishes available for this product (optional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATING_TYPES.map((plating) => (
                <label
                  key={plating.value}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    product.plating?.some(p => p.type === plating.value)
                      ? 'border-gold-500 bg-gold-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={product.plating?.some(p => p.type === plating.value) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProduct(prev => ({
                          ...prev,
                          plating: [...(prev.plating || []), { type: plating.value as any, available: true }]
                        }));
                      } else {
                        setProduct(prev => ({
                          ...prev,
                          plating: prev.plating?.filter(p => p.type !== plating.value)
                        }));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span 
                    className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" 
                    style={{ backgroundColor: plating.color }}
                  />
                  <span className="text-sm font-medium">{plating.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product Images *</h2>
            <ImageUploader
              images={product.images || []}
              onChange={(images) => {
                setProduct(prev => ({ ...prev, images }))
                clearError('images')
                handleFieldBlur('images', images)
              }}
            />
            {errors.images && (
              <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.images}</span>
              </div>
            )}
          </div>

          {/* Sizes Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sizes (Optional)</h2>
            <div className="space-y-3">
              {(product.sizes || []).map((size, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    placeholder="Size label (e.g., Small, 7, M)"
                    value={size.label}
                    onChange={(e) => {
                      const newSizes = [...(product.sizes || [])]
                      newSizes[index] = { ...size, label: e.target.value }
                      setProduct(prev => ({ ...prev, sizes: newSizes }))
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={size.value}
                    onChange={(e) => {
                      const newSizes = [...(product.sizes || [])]
                      newSizes[index] = { ...size, value: e.target.value }
                      setProduct(prev => ({ ...prev, sizes: newSizes }))
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newSizes = (product.sizes || []).filter((_, i) => i !== index)
                      setProduct(prev => ({ ...prev, sizes: newSizes }))
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newSizes = [...(product.sizes || []), { label: '', value: '' }]
                  setProduct(prev => ({ ...prev, sizes: newSizes }))
                }}
              >
                Add Size
              </Button>
            </div>
          </div>

          {/* Gemstones Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Gemstones (Optional)</h2>
            <div className="space-y-4">
              {(product.gemstones || []).map((gemstone, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Gemstone Name</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={gemstone.name}
                        onChange={(e) => {
                          const newGemstones = [...(product.gemstones || [])]
                          newGemstones[index] = { ...gemstone, name: e.target.value }
                          setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                        }}
                      >
                        <option value="">Select gemstone</option>
                        {GEMSTONE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Identifier/Color</Label>
                      <Input
                        placeholder="e.g., Blue, 2ct, AAA"
                        value={gemstone.value}
                        onChange={(e) => {
                          const newGemstones = [...(product.gemstones || [])]
                          newGemstones[index] = { ...gemstone, value: e.target.value }
                          setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Price Adjustment (LKR)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={gemstone.priceAdjustment || 0}
                        onChange={(e) => {
                          const newGemstones = [...(product.gemstones || [])]
                          newGemstones[index] = { ...gemstone, priceAdjustment: Number(e.target.value) }
                          setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newGemstones = (product.gemstones || []).filter((_, i) => i !== index)
                          setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                        }}
                      >
                        Remove Gemstone
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      placeholder="Optional description about this gemstone option"
                      value={gemstone.description || ''}
                      onChange={(e) => {
                        const newGemstones = [...(product.gemstones || [])]
                        newGemstones[index] = { ...gemstone, description: e.target.value }
                        setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newGemstones = [...(product.gemstones || []), { name: '', value: '', priceAdjustment: 0 }]
                  setProduct(prev => ({ ...prev, gemstones: newGemstones }))
                }}
              >
                Add Gemstone Option
              </Button>
            </div>
          </div>

          {/* Availability & Lead Time */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Availability & Lead Time</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="availability">Availability Status</Label>
                <select
                  id="availability"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={product.availability || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, availability: e.target.value }))}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="lead_time">Lead Time</Label>
                <Input
                  id="lead_time"
                  value={product.lead_time || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, lead_time: e.target.value }))}
                  placeholder="e.g., 2-3 weeks, 10 business days"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={product.customizable}
                  onChange={(e) => setProduct(prev => ({ ...prev, customizable: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="customizable" className="ml-2 cursor-pointer">
                  Customizable (Can be modified per customer request)
                </Label>
              </div>

              <div>
                <Label htmlFor="status_note">Status Note</Label>
                <Textarea
                  id="status_note"
                  rows={2}
                  value={product.status_note || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, status_note: e.target.value }))}
                  placeholder="Internal note about this product's status"
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Visibility & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={product.in_stock}
                  onChange={(e) => setProduct(prev => ({ ...prev, in_stock: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="in_stock" className="ml-2 cursor-pointer">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={product.featured}
                  onChange={(e) => setProduct(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="featured" className="ml-2 cursor-pointer">
                  Featured Product
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex justify-between items-center bg-white rounded-lg shadow p-4 sm:p-6">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="h-11 sm:h-10">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-2 sm:gap-3">
              {product.status === 'published' ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 sm:h-10"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  Move to Draft
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 sm:h-10"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  <Save className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                  Save as Draft
                </Button>
              )}
              <Button
                type="button"
                className="h-11 sm:h-10"
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                {product.status === 'published' ? 'Update' : 'Publish'} Product
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Action Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 safe-area-pb">
          <div className="flex flex-col gap-2">
            {product.status === 'published' ? (
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                Move to Draft
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                <Save className="mr-2 h-5 w-5" />
                Save as Draft
              </Button>
            )}
            <Button
              type="button"
              className="w-full h-11"
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              {product.status === 'published' ? 'Update' : 'Publish'} Product
            </Button>
            <Link href="/admin/products" className="block">
              <Button type="button" variant="ghost" className="w-full h-11">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                handleDelete()
                setDeleteDialogOpen(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

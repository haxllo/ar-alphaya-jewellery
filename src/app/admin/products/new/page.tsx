'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { CheckboxGrid } from '@/components/admin/CheckboxGrid'
import { PRODUCT_CATEGORIES, MATERIALS, SIZE_OPTIONS, AVAILABILITY_OPTIONS, GEMSTONE_TYPES, PLATING_TYPES } from '@/lib/admin/constants'
import { generateSlugFromName } from '@/lib/admin/validation'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useProductValidation } from '@/hooks/useProductValidation'
import type { ProductFormData, Size, Gemstone, PlatingOption } from '@/types/admin'

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { errors, validateForm, validateField, clearError, setFieldError } = useProductValidation()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    currency: 'LKR',
    images: [],
    category: 'rings',
    sku: '',
    materials: [],
    weight: null,
    dimensions: '',
    sizes: [],
    gemstones: [],
    plating: [],
    in_stock: true,
    featured: false,
    status: 'draft',
    availability: '',
    lead_time: '',
    customizable: false,
    status_note: ''
  })

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlugFromName(name)
    }))
    // Clear errors when field is modified
    clearError('name')
    clearError('slug')
  }

  const handleFieldBlur = (field: keyof ProductFormData, value: any) => {
    const error = validateField(field, value)
    if (error) {
      setFieldError(field as any, error)
    } else {
      clearError(field as any)
    }
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault()

    // Validate form before submission
    const isValid = validateForm(formData)
    
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix all errors before submitting the form.",
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
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }

      toast({
        variant: "success",
        title: "Product Created!",
        description: status === 'published' 
          ? "Product published successfully - now visible on website"
          : "Product saved as draft",
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Product</h1>
        </div>

        <form className="space-y-6 sm:space-y-8 pb-20 sm:pb-0">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleNameChange(e.target.value)
                    clearError('name')
                  }}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  placeholder="e.g., Diamond Engagement Ring"
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
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, slug: e.target.value }))
                    clearError('slug')
                  }}
                  onBlur={(e) => handleFieldBlur('slug', e.target.value)}
                  placeholder="diamond-engagement-ring"
                  className={errors.slug ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {errors.slug && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.slug}</span>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  https://aralphayajewellery.com/products/{formData.slug || 'product-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                    clearError('description')
                  }}
                  onBlur={(e) => handleFieldBlur('description', e.target.value)}
                  placeholder="Describe the product in detail..."
                  rows={6}
                  className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.description && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="cardDescription">Card Description (Short)</Label>
                <Textarea
                  id="cardDescription"
                  value={formData.cardDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardDescription: e.target.value }))}
                  placeholder="Brief description for product cards (1-2 lines)"
                  maxLength={150}
                  rows={2}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Shown only on product cards. {150 - (formData.cardDescription?.length || 0)} characters remaining
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className={`flex h-10 w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 ${errors.category ? 'focus-visible:ring-red-500' : 'focus-visible:ring-ring'}`}
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value }))
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
                    value={formData.sku}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, sku: e.target.value }))
                      clearError('sku')
                    }}
                    onBlur={(e) => handleFieldBlur('sku', e.target.value)}
                    placeholder="RING-001"
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
                  value={formData.price}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, price: Number(e.target.value) }))
                    clearError('price')
                  }}
                  onBlur={(e) => handleFieldBlur('price', Number(e.target.value))}
                  min="0"
                  step="1"
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
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  disabled
                />
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
                selected={formData.materials || []}
                onChange={(materials) => setFormData(prev => ({ ...prev, materials }))}
                columns={4}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    type="text"
                    value={formData.weight || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, weight: e.target.value || null }))
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
                    value={formData.dimensions || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, dimensions: e.target.value }))
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
                label="Available Sizes"
                options={SIZE_OPTIONS}
                selected={formData.sizes || []}
                onChange={(sizes) => setFormData(prev => ({ ...prev, sizes: sizes as Size[] }))}
                columns={4}
              />
            </div>
          </div>

          {/* Plating Options Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Plating Options</h2>
            <p className="text-sm text-gray-600 mb-4">Select plating finishes available for this product (optional)</p>
            <div className="space-y-3">
              {PLATING_TYPES.map((plating) => (
                <div key={plating.value} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.plating?.some(p => p.type === plating.value) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            plating: [...(prev.plating || []), { 
                              type: plating.value as any, 
                              label: plating.label,
                              priceAdjustment: plating.priceAdjustment,
                              available: true 
                            }]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            plating: prev.plating?.filter(p => p.type !== plating.value)
                          }));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-metal-gold-gold focus:ring-metal-gold-gold"
                    />
                    <span className="font-medium">{plating.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {plating.priceAdjustment === 0 ? 'Base price' : `+Rs. ${plating.priceAdjustment.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product Images *</h2>
            <ImageUploader
              images={formData.images || []}
              onChange={(images) => {
                setFormData(prev => ({ ...prev, images }))
                clearError('images')
                // Validate images when changed
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



          {/* Gemstones Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Gemstones (Optional)</h2>
            <div className="space-y-4">
              {(formData.gemstones || []).map((gemstone, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Gemstone Name</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={gemstone.name}
                        onChange={(e) => {
                          const newGemstones = [...(formData.gemstones || [])]
                          newGemstones[index] = { ...gemstone, name: e.target.value }
                          setFormData(prev => ({ ...prev, gemstones: newGemstones }))
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
                          const newGemstones = [...(formData.gemstones || [])]
                          newGemstones[index] = { ...gemstone, value: e.target.value }
                          setFormData(prev => ({ ...prev, gemstones: newGemstones }))
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
                          const newGemstones = [...(formData.gemstones || [])]
                          newGemstones[index] = { ...gemstone, priceAdjustment: Number(e.target.value) }
                          setFormData(prev => ({ ...prev, gemstones: newGemstones }))
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newGemstones = (formData.gemstones || []).filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, gemstones: newGemstones }))
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
                        const newGemstones = [...(formData.gemstones || [])]
                        newGemstones[index] = { ...gemstone, description: e.target.value }
                        setFormData(prev => ({ ...prev, gemstones: newGemstones }))
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newGemstones = [...(formData.gemstones || []), { name: '', value: '', priceAdjustment: 0 }]
                  setFormData(prev => ({ ...prev, gemstones: newGemstones }))
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
                  value={formData.availability || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
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
                  value={formData.lead_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lead_time: e.target.value }))}
                  placeholder="e.g., 2-3 weeks, 10 business days"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={formData.customizable}
                  onChange={(e) => setFormData(prev => ({ ...prev, customizable: e.target.checked }))}
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
                  value={formData.status_note || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, status_note: e.target.value }))}
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
                  checked={formData.in_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
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
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="featured" className="ml-2 cursor-pointer">
                  Featured Product
                </Label>
              </div>
            </div>
          </div>

          {/* Actions - Fixed on Mobile, Inline on Desktop */}
          <div className="hidden sm:flex justify-between items-center bg-white rounded-lg shadow p-4 sm:p-6">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="h-11 sm:h-10">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 sm:h-10"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={saving}
              >
                <Save className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
                Save as Draft
              </Button>
              <Button
                type="button"
                className="h-11 sm:h-10"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={saving}
              >
                {saving ? 'Publishing...' : 'Publish Product'}
              </Button>
            </div>
          </div>
        </form>

        {/* Mobile Fixed Action Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 safe-area-pb">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={saving}
            >
              <Save className="mr-2 h-5 w-5" />
              Save as Draft
            </Button>
            <Button
              type="button"
              className="w-full h-11"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish Product'}
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
    </div>
  )
}

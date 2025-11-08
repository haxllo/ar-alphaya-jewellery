'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PRODUCT_CATEGORIES, MATERIALS, COMMON_TAGS } from '@/lib/admin/constants'
import { generateSlugFromName } from '@/lib/admin/validation'
import type { ProductFormData } from '@/types/admin'

export default function NewProductPage() {
  const router = useRouter()
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
    tags: [],
    weight: null,
    dimensions: '',
    sizes: [],
    gemstones: [],
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
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault()
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

      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        </div>

        <form className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Diamond Engagement Ring"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="diamond-engagement-ring"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  https://aralphayajewellery.com/products/{formData.slug || 'product-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product in detail..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="RING-001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  min="0"
                  step="1"
                  required
                />
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

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Images *</h2>
            <ImageUploader
              images={formData.images || []}
              onChange={(images) => setFormData(prev => ({ ...prev, images }))}
            />
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="grid grid-cols-2 gap-4">
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

          {/* Actions */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={saving}
              >
                {saving ? 'Publishing...' : 'Publish Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

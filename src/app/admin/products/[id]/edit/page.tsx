'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PRODUCT_CATEGORIES } from '@/lib/admin/constants'
import type { Product } from '@/types/admin'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Partial<Product>>({})

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (status?: 'draft' | 'published') => {
    setSaving(true)

    try {
      const updateData = { ...product }
      if (status) {
        updateData.status = status
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={product.slug}
                  onChange={(e) => setProduct(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={product.category}
                    onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
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
                    value={product.sku || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, sku: e.target.value }))}
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
                  value={product.price}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input value="LKR" disabled />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Images *</h2>
            <ImageUploader
              images={product.images || []}
              onChange={(images) => setProduct(prev => ({ ...prev, images }))}
            />
          </div>

          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status & Visibility</h2>
            <div className="grid grid-cols-2 gap-4">
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

          {/* Action Buttons */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-3">
              {product.status === 'published' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  Move to Draft
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                {product.status === 'published' ? 'Update' : 'Publish'} Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

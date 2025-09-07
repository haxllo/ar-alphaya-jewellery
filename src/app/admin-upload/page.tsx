'use client'

import { useState } from 'react'
import { Upload, Image, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminUploadPage() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    price: '',
    category: 'rings',
    materials: [''],
    weight: '',
    dimensions: '',
    description: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('uploading')
    
    try {
      // Create FormData for API submission
      const submitData = new FormData()
      submitData.append('id', formData.id)
      submitData.append('name', formData.name)
      submitData.append('slug', formData.slug)
      submitData.append('price', formData.price)
      submitData.append('category', formData.category)
      submitData.append('materials', formData.materials.filter(m => m.trim()).join('\n'))
      submitData.append('weight', formData.weight)
      submitData.append('dimensions', formData.dimensions)
      submitData.append('description', formData.description)
      
      // Add images
      images.forEach((image) => {
        submitData.append('images', image)
      })
      
      // Submit to API
      const response = await fetch('/api/products/create', {
        method: 'POST',
        body: submitData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create product')
      }
      
      setStatus('success')
      setMessage(`Product "${formData.name}" created successfully! It will appear on your site shortly.`)
      
      // Reset form after success
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
        setFormData({
          id: '',
          name: '',
          slug: '',
          price: '',
          category: 'rings',
          materials: [''],
          weight: '',
          dimensions: '',
          description: ''
        })
        setImages([])
        
        // Reset file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      }, 4000)
      
    } catch (error) {
      console.error('Upload error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to create product. Please try again.')
      
      // Clear error after delay
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
              <p className="text-gray-600">Create a new product for AR Alphaya Jewellery</p>
            </div>
            <a 
              href="/admin-instructions" 
              className="text-primary-600 hover:text-primary-700 underline text-sm"
            >
              ← Back to Instructions
            </a>
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">{message}</p>
              </div>
              <div className="text-sm text-green-700 mb-4">
                <p>Your product has been created and saved. The site will automatically update to show your new product.</p>
                <p className="mt-1"><strong>Note:</strong> It may take 2-3 minutes for the product to appear on the live site due to deployment.</p>
              </div>
              {formData.slug && (
                <a
                  href={`/products/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  View Product (opens in new tab)
                </a>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="e.g., ruby-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Ruby Heart Pendant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., ruby-heart-pendant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (LKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 180000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="pendants">Pendants</option>
                  <option value="bracelets-bangles">Bracelets & Bangles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (grams)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 4.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 15mm x 12mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials (one per line)
              </label>
              <textarea
                name="materials"
                value={formData.materials.join('\n')}
                onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value.split('\n') }))}
                placeholder="18k Gold&#10;Natural Ruby&#10;Chain Included"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-primary-600 font-medium">Click to upload</span>
                  <span className="text-gray-500"> or drag and drop images</span>
                </label>
                {images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{images.length} image(s) selected</p>
                    <div className="flex gap-2 mt-2 justify-center flex-wrap">
                      {images.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                          <Image className="h-4 w-4" />
                          <span className="text-xs">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the product's features, craftsmanship, and appeal..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'uploading'}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'uploading' ? 'Creating Product...' : 'Create Product'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📋 Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Fill in all the product details</li>
              <li>Upload your product images</li>
              <li>Click "Create Product" to generate</li>
              <li>The system will create the product automatically</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

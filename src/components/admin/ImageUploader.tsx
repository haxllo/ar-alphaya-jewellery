'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('UPLOADCARE_PUB_KEY', '5eb856a1c841f37fa95c')

        const response = await fetch('https://upload.uploadcare.com/base/', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        return `https://ucarecdn.com/${data.file}/`
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Uploaded Images Grid */}
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      
      {/* Upload Area - Always Visible */}
      {images.length < maxImages && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {images.length > 0 ? 'Add More Images' : 'Upload Product Images'}
            </p>
            <p className="text-xs text-gray-500">
              {images.length} / {maxImages} uploaded
            </p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer inline-flex flex-col items-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-700 mb-1">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </span>
            </label>
          </div>
        </div>
      )}
      
      {images.length >= maxImages && (
        <p className="text-sm text-gray-600">Maximum {maxImages} images reached</p>
      )}
    </div>
  )
}

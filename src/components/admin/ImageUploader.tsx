'use client'

import { useState } from 'react'
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

  const handleUpload = () => {
    setUploading(true)
    
    try {
      // @ts-ignore - Uploadcare widget loaded via CDN
      const widget = window.uploadcare.Widget('[role=uploadcare-uploader]', {
        publicKey: '5eb856a1c841f37fa95c',
        multiple: true,
        multipleMax: maxImages - images.length,
        imagesOnly: true,
        previewStep: true,
        crop: 'free'
      })
      
      widget.onUploadComplete((info: any) => {
        const newUrls = info.files ? info.files.map((f: any) => f.cdnUrl) : [info.cdnUrl]
        onChange([...images, ...newUrls])
        setUploading(false)
      })
      
      widget.openDialog()
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      alert('Upload failed. Please try again.')
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {images.length} / {maxImages} images uploaded
        </p>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUpload}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Add Images'}
          </Button>
        )}
      </div>
      
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
      
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={handleUpload}
            disabled={uploading}
          >
            Upload Images
          </Button>
        </div>
      )}
      
      <input type="hidden" role="uploadcare-uploader" />
    </div>
  )
}

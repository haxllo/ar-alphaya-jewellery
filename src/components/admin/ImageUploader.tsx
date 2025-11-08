'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const ctxProviderRef = useRef<any>(null)
  const addedUrls = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Listen for file-upload-success event
    const handleUploadSuccess = (e: any) => {
      console.log('=== FILE UPLOAD SUCCESS EVENT ===')
      console.log('Success event detail:', e.detail)
      
      const file = e.detail
      if (file && file.cdnUrl) {
        // Extract UUID from cdnUrl
        const uuid = file.uuid || file.cdnUrl.split('/').find((part: string) => part.match(/^[a-f0-9-]{36}$/i))
        
        // Check if already added to prevent duplicates
        if (uuid && addedUrls.current.has(uuid)) {
          console.log('Image already added, skipping:', uuid)
          return
        }
        
        // Use simple CDN URL - NO TRAILING SLASH (Uploadcare returns 404 with slash)
        const cleanUrl = `https://ucarecdn.com/${uuid}`
        console.log('Adding URL from success event:', cleanUrl)
        
        if (uuid) {
          addedUrls.current.add(uuid)
        }
        onChange([...images, cleanUrl])
      }
    }

    const provider = document.querySelector('uc-upload-ctx-provider')
    if (provider) {
      ctxProviderRef.current = provider
      provider.addEventListener('file-upload-success', handleUploadSuccess)
      
      return () => {
        provider.removeEventListener('file-upload-success', handleUploadSuccess)
      }
    }
  }, [images, onChange])

  const handleChangeEvent = (e: any) => {
    console.log('=== UPLOADCARE CHANGE EVENT ===')
    console.log('Event type:', e.type)
    
    // IMPORTANT: Don't process onChange - let file-upload-success handle it
    // onChange fires multiple times (file added, uploading, success)
    // We only want to add URLs when file-upload-success fires
    
    const allEntries = e.detail?.allEntries || e.allEntries || []
    console.log('Change event - file count:', allEntries.length)
    console.log('File statuses:', allEntries.map((f: any) => ({
      name: f.name,
      status: f.status,
      uuid: f.uuid?.substring(0, 8) + '...'
    })))
    
    // Don't add images here - file-upload-success will handle it
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
          <FileUploaderRegular
            ctxName="product-uploader"
            pubkey="5eb856a1c841f37fa95c"
            classNameUploader="uc-light"
            sourceList="local, camera, url"
            multiple={true}
            multipleMax={maxImages - images.length}
            imgOnly={true}
            userAgentIntegration="llm-nextjs"
            onChange={handleChangeEvent}
          />
        </div>
      )}
      
      {images.length >= maxImages && (
        <p className="text-sm text-gray-600">Maximum {maxImages} images reached</p>
      )}
    </div>
  )
}

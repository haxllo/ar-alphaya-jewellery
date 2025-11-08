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
  const [showUploader, setShowUploader] = useState(false)
  const ctxProviderRef = useRef<any>(null)

  useEffect(() => {
    // Listen for file-upload-success event
    const handleUploadSuccess = (e: any) => {
      console.log('=== FILE UPLOAD SUCCESS EVENT ===')
      console.log('Success event detail:', e.detail)
      
      const file = e.detail
      if (file && file.cdnUrl) {
        const baseUrl = file.cdnUrl.replace(/\/$/, '')
        const optimizedUrl = `${baseUrl}/-/preview/-/format/auto/-/quality/smart/`
        console.log('Adding URL from success event:', optimizedUrl)
        
        onChange([...images, optimizedUrl])
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
    console.log('Full event:', e)
    console.log('Event type:', e.type)
    console.log('Event detail:', e.detail)
    
    // Try both e.detail and e directly (React wrapper differences)
    const allEntries = e.detail?.allEntries || e.allEntries || []
    console.log('All entries:', allEntries)
    
    if (allEntries.length === 0) {
      console.log('No files in event')
      return
    }
    
    // Log all file statuses to debug
    console.log('File statuses:', allEntries.map((f: any) => ({
      name: f.name,
      status: f.status,
      uuid: f.uuid,
      cdnUrl: f.cdnUrl
    })))
    
    // Filter only successful uploads
    const successfulFiles = allEntries.filter((file: any) => file.status === 'success')
    console.log('Successful files count:', successfulFiles.length)
    
    if (successfulFiles.length > 0) {
      const newUrls = successfulFiles.map((file: any) => {
        console.log('Processing file:', { uuid: file.uuid, cdnUrl: file.cdnUrl, status: file.status })
        
        // Uploadcare provides cdnUrl property with the full URL
        if (file.cdnUrl) {
          // Use the provided cdnUrl and add optimizations
          const baseUrl = file.cdnUrl.replace(/\/$/, '')
          const optimizedUrl = `${baseUrl}/-/preview/-/format/auto/-/quality/smart/`
          console.log('Generated URL from cdnUrl:', optimizedUrl)
          return optimizedUrl
        }
        
        // Fallback: construct URL from uuid if cdnUrl is missing
        if (file.uuid) {
          const constructedUrl = `https://ucarecdn.com/${file.uuid}/-/preview/-/format/auto/-/quality/smart/`
          console.log('Generated URL from uuid:', constructedUrl)
          return constructedUrl
        }
        
        console.warn('File missing both cdnUrl and uuid:', file)
        return null
      }).filter(Boolean) as string[]
      
      console.log('Final URLs to add:', newUrls)
      
      if (newUrls.length > 0) {
        const updatedImages = [...images, ...newUrls]
        console.log('Updated images array:', updatedImages)
        onChange(updatedImages)
        setShowUploader(false)
      }
    } else {
      console.log('No successful uploads yet')
      console.log('Current statuses:', allEntries.map((f: any) => f.status))
    }
  }

  const handleOpenUploader = () => {
    setShowUploader(true)
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
        {images.length < maxImages && !showUploader && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenUploader}
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        )}
      </div>
      
      {showUploader && images.length < maxImages && (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
          <FileUploaderRegular
            ctxName="product-uploader"
            pubkey="5eb856a1c841f37fa95c"
            classNameUploader="uc-light uc-purple"
            sourceList="local, camera, url"
            multiple={true}
            multipleMax={maxImages - images.length}
            imgOnly={true}
            userAgentIntegration="llm-nextjs"
            filesViewMode="grid"
            onChange={handleChangeEvent}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setShowUploader(false)}
          >
            Cancel
          </Button>
        </div>
      )}
      
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
      
      {images.length === 0 && !showUploader && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={handleOpenUploader}
          >
            Upload Images
          </Button>
        </div>
      )}
    </div>
  )
}

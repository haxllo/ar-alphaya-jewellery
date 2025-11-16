'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
  onLoad?: () => void
}

// Generate blur placeholder SVG
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

// Uploadcare transformations
const getUploadcareUrl = (url: string, width?: number): string => {
  if (!url) return ''
  
  // Normalize Uploadcare URLs to use project-specific CDN subdomain
  // Generic ucarecdn.com doesn't work with Vercel Image Optimization
  if (url.includes('ucarecdn.com/')) {
    const uuid = url.match(/ucarecdn\.com\/([^/]+)/)?.[1]
    if (uuid) {
      url = `https://2vhk07la2x.ucarecd.net/${uuid}/`
    }
  }
  
  // Check if it's an Uploadcare URL
  if (!url.includes('ucarecd.net')) return url
  
  // Apply transformations for optimization
  if (width) {
    // Format: https://2vhk07la2x.ucarecd.net/uuid/-/preview/800x800/-/format/auto/
    // - preview: Resizes image to specified dimensions
    // - format/auto: Automatically converts HEIC/HEIF and selects best format (AVIF/WebP/JPEG/PNG)
    // - Adaptive Quality: Enabled by default, intelligently compresses each image for optimal quality/size
    const uuid = url.match(/ucarecd\.net\/([^/-]+)/)?.[1]
    if (uuid) {
      return `https://2vhk07la2x.ucarecd.net/${uuid}/-/preview/${width}x${width}/-/format/auto/`
    }
  }
  
  // If no width specified, still apply format/auto for HEIC support
  const uuid = url.match(/ucarecd\.net\/([^/-]+)/)?.[1]
  if (uuid) {
    return `https://2vhk07la2x.ucarecd.net/${uuid}/-/format/auto/`
  }
  
  return url
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  className = '',
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Determine optimal width for Uploadcare transformation
  const transformWidth = width || 800
  const optimizedSrc = getUploadcareUrl(src, transformWidth)
  
  const imageProps: any = {
    src: optimizedSrc,
    alt,
    className: `${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`,
    onLoad: () => {
      setIsLoading(false)
      onLoad?.()
    },
    placeholder: 'blur' as const,
    blurDataURL: `data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 700))}`,
  }

  if (fill) {
    imageProps.fill = true
    imageProps.sizes = sizes || '100vw'
  } else {
    imageProps.width = width
    imageProps.height = height
  }

  if (priority) {
    imageProps.priority = true
    imageProps.loading = undefined
  } else {
    imageProps.loading = 'lazy' as const
  }

  return (
    <>
      <Image {...imageProps} />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </>
  )
}

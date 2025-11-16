/**
 * Helper to fix Uploadcare URLs for HEIC support
 * Adds -/format/auto/ to convert HEIC/HEIF files to browser-compatible formats
 * Use this helper in all components that display Uploadcare images
 */

export function fixUploadcareUrl(url: string | undefined | null): string {
  if (!url) return ''
  
  // Already has transformations, return as-is
  if (url.includes('/-/')) {
    return url
  }
  
  // Extract UUID from any Uploadcare URL format
  let uuid = ''
  if (url.includes('ucarecdn.com/')) {
    uuid = url.match(/ucarecdn\.com\/([^/]+)/)?.[1] || ''
  } else if (url.includes('ucarecd.net/')) {
    uuid = url.match(/ucarecd\.net\/([^/]+)/)?.[1] || ''
  }
  
  // Return with format/auto to convert HEIC files
  if (uuid) {
    return `https://2vhk07la2x.ucarecd.net/${uuid}/-/format/auto/`
  }
  
  return url
}

import { getProducts, getProductCategories } from '@/lib/cms'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/policies',
    '/privacy',
    '/returns',
    '/shipping',
    '/terms',
    '/search',
    '/wishlist',
    '/compare',
  ].map((path) => ({ 
    url: `${baseUrl}${path}`, 
    lastModified: new Date().toISOString() 
  }))

  // Get categories from products and merge with default collections
  const productCategories = await getProductCategories()
  const defaultCollections = ['rings', 'earrings', 'pendants', 'bracelets-bangles']
  const uniqueCategories = Array.from(new Set([...productCategories, ...defaultCollections]))

  const collections = uniqueCategories.map((handle) => ({ 
    url: `${baseUrl}/collections/${handle}`, 
    lastModified: new Date().toISOString() 
  }))

  const products = await getProducts()
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt || new Date().toISOString(),
  }))

  return [...staticRoutes, ...collections, ...productRoutes]
}

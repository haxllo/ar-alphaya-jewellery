import { getProducts } from '@/lib/cms'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/returns',
    '/shipping',
    '/terms',
    '/search',
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date().toISOString() }))

  const collections = [
    'rings',
    'earrings',
    'pendants',
    'bracelets-bangles',
  ].map((handle) => ({ url: `${baseUrl}/collections/${handle}`, lastModified: new Date().toISOString() }))

  const products = await getProducts()
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt || new Date().toISOString(),
  }))

  return [...staticRoutes, ...collections, ...productRoutes]
}

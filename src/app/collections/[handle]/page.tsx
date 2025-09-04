import { getProductsByCollection, getAllProducts } from '@/lib/cms/content'
import CollectionContent from './CollectionContent'

export async function generateStaticParams() {
  // Get categories from existing products
  const products = getAllProducts()
  const productCategories = Array.from(new Set(products.map(p => p.category)))
  
  // Define all collections from navigation (to ensure all routes work)
  const allCollections = ['rings', 'earrings', 'pendants', 'bracelets-bangles']
  
  // Merge and deduplicate
  const uniqueCategories = Array.from(new Set([...productCategories, ...allCollections]))
  return uniqueCategories.map((handle) => ({ handle }))
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const products = getProductsByCollection(handle)
  return <CollectionContent handle={handle} products={products} />
}


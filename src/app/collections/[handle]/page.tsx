import { getProductsByCollection, getAllProducts } from '@/lib/cms/content'
import Link from 'next/link'

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
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 capitalize text-black">{handle.replace('-', ' ')}</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group border border-gray-200 rounded p-3 hover:shadow-sm hover:border-gray-300 transition-all">
              <div className="aspect-square bg-gray-100 rounded mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black group-hover:underline">{p.name}</h3>
                <span className="text-sm text-gray-600">Rs {p.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}


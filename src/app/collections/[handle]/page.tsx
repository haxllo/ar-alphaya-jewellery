import { getProductsByCollection, getAllProducts } from '@/lib/cms/content'
import Link from 'next/link'

export async function generateStaticParams() {
  const products = getAllProducts()
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
  return uniqueCategories.map((handle) => ({ handle }))
}

export default function CollectionPage({ params }: { params: { handle: string } }) {
  const products = getProductsByCollection(params.handle)
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-6 capitalize text-primary-800">{params.handle.replace('-', ' ')}</h1>
      {products.length === 0 ? (
        <p className="text-primary-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group border border-border rounded p-3 hover:shadow-sm hover:border-primary-300 transition-all">
              <div className="aspect-square bg-primary-100 rounded mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary-800 group-hover:underline">{p.name}</h3>
                <span className="text-sm text-primary-600">Rs {p.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}


import { getProductBySlug, getAllProducts } from '@/lib/cms/content'
import { notFound } from 'next/navigation'
import AddToCart from '@/components/cart/add-to-cart'

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) {
    return notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-neutral-100 rounded mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded" />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
          <p className="text-2xl mb-4">Rs {product.price.toLocaleString()}</p>
          
          {product.materials && product.materials.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Materials</h3>
              <p className="text-sm text-neutral-600">{product.materials.join(', ')}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <div className="text-sm text-neutral-600 whitespace-pre-wrap">{product.description}</div>
          </div>

          <AddToCart product={product} />
        </div>
      </div>
    </main>
  )
}

import { getProductBySlug, getAllProducts } from '@/lib/strapi/products'
import { notFound } from 'next/navigation'
import ProductContent from './ProductContent'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return notFound()
  }

  return <ProductContent product={product} />
}

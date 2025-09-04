import { getProductBySlug, getAllProducts } from '@/lib/cms/content'
import { notFound } from 'next/navigation'
import ProductContent from './ProductContent'

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) {
    return notFound()
  }

  return <ProductContent product={product} />
}

import { getProductBySlug, getProducts } from '@/lib/cms'
import type { Metadata } from 'next'

export const revalidate = 60;
import { notFound } from 'next/navigation'
import ProductContent from './ProductContent'

export async function generateStaticParams() {
  const products = await getProducts()
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/products/${product.slug}`

  return {
    title: `${product.name} | AR Alphaya Jewellery`,
    description: product.description?.slice(0, 160) || `Buy ${product.name} at AR Alphaya Jewellery`,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | AR Alphaya Jewellery`,
      description: product.description || undefined,
      url,
      images: product.images?.[0] ? [product.images[0]] : undefined,
      type: 'website'
    },
  }
}

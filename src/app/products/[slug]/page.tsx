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

  // Product JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    sku: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: 'AR Alphaya Jewellery',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency || 'LKR',
      price: product.price,
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
    },
  }

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: (product.category || '').replace('-', ' '),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/collections/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductContent product={product} />
    </>
  )
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

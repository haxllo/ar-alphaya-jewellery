import type { Product } from '@/types/product'

interface BreadcrumbItem {
  name: string
  url: string
}

interface StructuredDataProps {
  type: 'product' | 'productList' | 'breadcrumb' | 'faq' | 'organization'
  data?: any
}

export function ProductStructuredData({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'AR Alphaya Jewellery'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: product.currency || 'LKR',
      price: product.price,
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'AR Alphaya Jewellery'
      }
    }
  }

  if (product.materials && product.materials.length > 0) {
    Object.assign(schema, {
      material: product.materials.join(', ')
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductListStructuredData({ 
  products, 
  category 
}: { 
  products: Product[]
  category?: string 
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
        image: product.images?.[0],
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'LKR',
          availability: product.inStock 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock'
        }
      }
    }))
  }

  if (category) {
    Object.assign(schema, {
      name: `${category.replace('-', ' ')} Collection`,
      description: `Browse our ${category.replace('-', ' ')} collection at AR Alphaya Jewellery`
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': process.env.NEXT_PUBLIC_SITE_URL,
    name: 'AR Alphaya Jewellery',
    description: 'A one-person atelier crafting custom jewellery in Kandy, Sri Lanka. Explore limited studio creations and commission coloured gemstone pieces made just for you.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/LOGO1.png`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/images/LOGO2.png`,
    telephone: '+94-77-429-3406',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kandy',
      addressCountry: 'LK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '7.2906',
      longitude: '80.6337'
    },
    priceRange: '$$',
    currenciesAccepted: 'LKR, USD, EUR, GBP',
    paymentAccepted: 'Credit Card, Debit Card, Bank Transfer',
    sameAs: [
      'https://www.instagram.com/ar_alphaya_jewellery/'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

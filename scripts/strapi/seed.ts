#!/usr/bin/env ts-node

/**
 * Strapi seed script
 * - Creates sample product data in Strapi
 * - Posts to Strapi REST API using STRAPI_TOKEN
 *
 * Prerequisites
 * - Create content-types in Strapi with the following API IDs and fields:
 *   1) Collection type: product (api::product.product)
 *      - productId (text)
 *      - name (text)
 *      - slug (UID, target: name)
 *      - price (integer)
 *      - currency (text)
 *      - images (media, multiple)
 *      - category (enumeration: rings, earrings, pendants, bracelets-bangles)
 *      - sku (text, optional)
 *      - materials (JSON)
 *      - weight (decimal)
 *      - dimensions (text)
 *      - sizes (JSON)
 *      - gemstones (JSON)
 *      - inStock (boolean)
 *      - featured (boolean)
 *      - tags (JSON)
 *      - body (rich text or text)
 *      - originalCreatedAt (datetime)
 *      - originalUpdatedAt (datetime)
 *
 * Notes
 * - Ensure the API permissions allow creation with your API token.
 */

const STRAPI_URL_SEED = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN_SEED = process.env.STRAPI_TOKEN

if (!STRAPI_URL_SEED || !STRAPI_TOKEN_SEED) {
  console.error('Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_TOKEN in environment.')
  process.exit(1)
}

async function postStrapi(endpoint: string, data: any) {
  const res = await fetch(`${STRAPI_URL_SEED}/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN_SEED}`,
    },
    body: JSON.stringify({ data }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${endpoint} failed: ${res.status} ${text}`)
  }
  return res.json()
}

function getSampleProducts() {
  return [
    {
      productId: 'RING001',
      name: 'Elegant Diamond Ring',
      slug: 'elegant-diamond-ring',
      price: 45000,
      currency: 'LKR',
      category: 'rings',
      sku: 'RNG-DIA-001',
      materials: ['18k Gold', 'Diamond'],
      weight: 3.5,
      dimensions: 'Ring Size 7',
      sizes: ['6', '7', '8', '9'],
      gemstones: ['Diamond - 0.5 carat'],
      inStock: true,
      featured: true,
      tags: ['engagement', 'diamond', 'luxury'],
      body: 'Beautiful handcrafted diamond ring perfect for engagements and special occasions.',
      originalCreatedAt: new Date().toISOString(),
      originalUpdatedAt: new Date().toISOString(),
    },
    {
      productId: 'EAR002',
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      price: 12500,
      currency: 'LKR',
      category: 'earrings',
      sku: 'EAR-PRL-002',
      materials: ['Sterling Silver', 'Freshwater Pearl'],
      weight: 2.1,
      dimensions: '25mm length',
      sizes: [],
      gemstones: ['Freshwater Pearl'],
      inStock: true,
      featured: false,
      tags: ['pearl', 'elegant', 'formal'],
      body: 'Classic pearl drop earrings that complement any formal attire.',
      originalCreatedAt: new Date().toISOString(),
      originalUpdatedAt: new Date().toISOString(),
    },
    {
      productId: 'PEN003',
      name: 'Sapphire Heart Pendant',
      slug: 'sapphire-heart-pendant',
      price: 28000,
      currency: 'LKR',
      category: 'pendants',
      sku: 'PEN-SAP-003',
      materials: ['14k White Gold', 'Blue Sapphire'],
      weight: 4.2,
      dimensions: '15mm x 12mm',
      sizes: [],
      gemstones: ['Blue Sapphire - 1 carat'],
      inStock: true,
      featured: true,
      tags: ['sapphire', 'heart', 'romantic'],
      body: 'Stunning heart-shaped pendant featuring a brilliant blue sapphire.',
      originalCreatedAt: new Date().toISOString(),
      originalUpdatedAt: new Date().toISOString(),
    }
  ]
}

async function seed() {
  // Seed products
  const products = getSampleProducts()
  console.log(`Seeding ${products.length} sample products...`)
  
  for (const p of products) {
    try {
      await postStrapi('/products', p)
      console.log(`Created product: ${p.slug}`)
    } catch (e: any) {
      console.warn(`Product ${p.slug} failed: ${e.message}`)
    }
  }
  
  console.log('Seeding completed!')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})

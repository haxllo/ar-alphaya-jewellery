#!/usr/bin/env ts-node

/**
 * Strapi seed script
 * - Reads local data (src/data/products/*.md and src/data/site.json)
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
 *   2) Single type: site-setting (api::site-setting.site-setting)
 *      - title (text)
 *      - description (text)
 *      - email (text)
 *      - phone (text)
 *      - whatsapp (text)
 *      - address (text)
 *      - instagram (text)
 *      - collections (JSON)
 *
 * Notes
 * - Ensure the API permissions allow creation with your API token.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_TOKEN

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error('Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_TOKEN in environment.')
  process.exit(1)
}

async function postStrapi(endpoint: string, data: any) {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST ${endpoint} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function upsertSingle(endpoint: string, data: any) {
  // Try get, then put; if 404, post
  const getRes = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  })

  if (getRes.ok) {
    const putRes = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    })
    if (!putRes.ok) {
      const text = await putRes.text()
      throw new Error(`PUT ${endpoint} failed: ${putRes.status} ${text}`)
    }
    return putRes.json()
  }

  // Fallback to create
  return postStrapi(endpoint, data)
}

function readProducts() {
  const productsDir = path.join(process.cwd(), 'src', 'data', 'products')
  const files = fs.readdirSync(productsDir).filter((f) => f.endsWith('.md'))
  return files.map((file) => {
    const full = path.join(productsDir, file)
    const raw = fs.readFileSync(full, 'utf8')
    const { data, content } = matter(raw)

    // Normalize to Strapi fields
    return {
      productId: data.id,
      name: data.name,
      slug: data.slug,
      price: data.price,
      currency: data.currency,
      images: data.images, // You must upload media separately or store URLs
      category: data.category,
      sku: data.sku || null,
      materials: data.materials || [],
      weight: data.weight ?? null,
      dimensions: data.dimensions || null,
      sizes: data.sizes || [],
      gemstones: data.gemstones || [],
      inStock: !!data.inStock,
      featured: !!data.featured,
      tags: data.tags || [],
      body: content.trim(),
      originalCreatedAt: data.createdAt || null,
      originalUpdatedAt: data.updatedAt || null,
      publishedAt: null, // keep draft, publish manually if needed
    }
  })
}

function readSite() {
  const sitePath = path.join(process.cwd(), 'src', 'data', 'site.json')
  const raw = fs.readFileSync(sitePath, 'utf8')
  return JSON.parse(raw)
}

async function seed() {
  // Seed site-setting
  const site = readSite()
  console.log('Seeding site-setting...')
  await upsertSingle('/site-setting', {
    title: site.title,
    description: site.description,
    email: site.email,
    phone: site.phone,
    whatsapp: site.whatsapp,
    address: site.address,
    instagram: site.instagram,
    collections: site.collections,
  })
  console.log('Site-setting done.')

  // Seed products
  const products = readProducts()
  console.log(`Seeding ${products.length} products...`)
  for (const p of products) {
    try {
      await postStrapi('/products', p)
      console.log(`Created product: ${p.slug}`)
    } catch (e: any) {
      console.warn(`Product ${p.slug} failed: ${e.message}`)
    }
  }
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})

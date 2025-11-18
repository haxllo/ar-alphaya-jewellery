import fs from 'node:fs/promises'
import path from 'node:path'
import { productSchema } from '../src/lib/validation'

async function main() {
  const productsDir = path.join(process.cwd(), 'public', 'products')
  let hasErrors = false

  try {
    const entries = await fs.readdir(productsDir, { withFileTypes: true })
    const jsonFiles = entries.filter(e => e.isFile() && e.name.toLowerCase().endsWith('.json'))

    if (jsonFiles.length === 0) {
      console.log('No product JSON files found - validation skipped')
      return
    }

    for (const f of jsonFiles) {
      const filePath = path.join(productsDir, f.name)
      try {
        const raw = JSON.parse(await fs.readFile(filePath, 'utf8'))
        const data = {
          name: raw?.name ?? '',
          slug: raw?.slug ?? '',
          price: Number(raw?.price ?? 0),
          currency: raw?.currency ?? 'LKR',
          category: raw?.category ?? 'rings',
          images: Array.isArray(raw?.images) ? raw.images.filter((u: any) => typeof u === 'string') : [],
          sku: raw?.sku,
          materials: raw?.materials,
          weight: raw?.weight != null ? Number(raw.weight) : undefined,
          dimensions: raw?.dimensions,
          sizes: raw?.sizes,
          gemstones: raw?.gemstones,
          inStock: raw?.inStock,
          featured: raw?.featured,
          tags: raw?.tags,
          body: raw?.body ?? raw?.description,
        }
        productSchema.parse(data)
        console.log(`OK  ${f.name}`)
      } catch (err: any) {
        hasErrors = true
        console.error(`ERR ${f.name}: ${err?.message || err}`)
      }
    }
  } catch (e: any) {
    // Directory doesn't exist - that's okay, no products to validate
    if (e.code === 'ENOENT') {
      console.log('Products directory not found - validation skipped')
      return
    }
    hasErrors = true
    console.error(`Failed to read products directory: ${e?.message || e}`)
  }

  if (hasErrors) {
    process.exitCode = 1
  }
}

main()



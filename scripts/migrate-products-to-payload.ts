import { createClient } from '@supabase/supabase-js'
import { getPayload } from 'payload'
import config from './payload-migration.config'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  const payload = await getPayload({ config })
  
  console.log('Fetching products from Legacy Supabase...')
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching products:', error)
    process.exit(1)
  }

  console.log(`Found ${products.length} products to migrate.`)

  for (const product of products) {
    console.log(`Migrating product: ${product.name}`)
    
    // Handle images (Uploadcare URLs)
    const imageIds = []
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i]
        
        try {
          // Create Media item with URL directly
          // We don't need 'file' because it's an external URL now
          const media = await payload.create({
            collection: 'media',
            data: {
              alt: product.name,
              url: imageUrl, // Directly setting the URL
            },
          })
          
          imageIds.push(media.id)
        } catch (err) {
          console.error(`Failed to migrate image for ${product.name}:`, err)
        }
      }
    }

    // Map materials
    const mapMaterial = (m: string) => {
      const lower = m.toLowerCase()
      if (lower.includes('silver')) return 'silver'
      if (lower.includes('18k')) return 'gold-18k'
      if (lower.includes('24k')) return 'gold-24k'
      if (lower.includes('rose')) return 'rose-gold'
      if (lower.includes('platinum')) return 'platinum'
      return null
    }

    const validMaterials = (product.materials || [])
      .map(mapMaterial)
      .filter(Boolean)

    // Map product data
    const productData = {
          name: product.name,
          slug: product.slug,
          description: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: product.description || '',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          } as any,
          price: Number(product.price),
          currency: product.currency || 'LKR',
          category: product.category || 'rings',
          images: imageIds.map(id => ({ image: id })),
          sku: product.sku,
          materials: validMaterials, 
          weight: product.weight ? Number(product.weight) : undefined,
          dimensions: product.dimensions,
          sizes: product.sizes,
          inStock: product.in_stock ?? true,
          featured: product.featured ?? false,
          tags: product.tags,
          status: 'published',
          gemstones: product.gemstones ? product.gemstones.map((g: any) => ({
            name: g.name,
            value: g.value,
            priceAdjustment: g.priceAdjustment,
            description: g.description,
            available: g.available
          })) : [],
    }

    try {
      // Check if product exists
      const existing = await payload.find({
          collection: 'products',
          where: {
              slug: { equals: product.slug }
          },
          limit: 1
      })

      if (existing.docs.length > 0) {
          // Update
          await payload.update({
              collection: 'products',
              id: existing.docs[0].id,
              data: productData as any
          })
          console.log(`Updated existing product: ${product.name}`)
      } else {
          // Create
          await payload.create({
            collection: 'products',
            data: productData as any,
          })
          console.log(`Created new product: ${product.name}`)
      }

    } catch (err) {
      console.error(`Failed to upsert product ${product.name}:`, err)
    }
  }

  console.log('Migration complete!')
  process.exit(0)
}

migrate()

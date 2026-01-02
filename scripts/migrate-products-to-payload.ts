
import { createClient } from '@supabase/supabase-js'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function downloadImage(url: string, dest: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(() => resolve(dest))
      })
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err))
    })
  })
}

async function migrate() {
  const payload = await getPayload({ config })
  
  console.log('Fetching products from Supabase...')
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
    
    // Handle images
    const imageIds = []
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i]
        const imageName = `${product.slug}-${i}.jpg`
        const tempPath = path.join(dirname, 'temp', imageName)
        
        // Ensure temp directory exists
        if (!fs.existsSync(path.join(dirname, 'temp'))) {
          fs.mkdirSync(path.join(dirname, 'temp'))
        }

        try {
          await downloadImage(imageUrl, tempPath)
          const fileBuffer = fs.readFileSync(tempPath)
          
          const media = await payload.create({
            collection: 'media',
            data: {
              alt: product.name,
            },
            file: {
              data: fileBuffer,
              name: imageName,
              mimetype: 'image/jpeg',
              size: fs.statSync(tempPath).size,
            },
          })
          
          imageIds.push(media.id)
          
          // Cleanup temp file
          fs.unlinkSync(tempPath)
        } catch (err) {
          console.error(`Failed to migrate image for ${product.name}:`, err)
        }
      }
    }

    // Map materials to valid option values
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
    try {
      // Basic rich text structure for description
      const descriptionRichText = {
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
      }

      await payload.create({
        collection: 'products',
        data: {
          name: product.name,
          slug: product.slug,
          description: descriptionRichText as any,
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
        },
      })
      console.log(`Successfully migrated: ${product.name}`)
    } catch (err) {
      console.error(`Failed to create product ${product.name}:`, err)
    }
  }

  console.log('Migration complete!')
  process.exit(0)
}

migrate()

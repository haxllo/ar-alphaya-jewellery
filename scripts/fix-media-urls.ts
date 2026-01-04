
import { createClient } from '@supabase/supabase-js'
import { getPayload } from 'payload'
import config from './payload-migration.config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMediaUrls() {
  console.log('Starting media URL fix...')
  const payload = await getPayload({ config })
  
  // 1. Fetch Legacy Products (Source of Truth for URLs)
  const { data: legacyProducts, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching legacy products:', error)
    process.exit(1)
  }

  console.log(`Found ${legacyProducts.length} legacy products.`)

  // 2. Fetch Payload Products
  const { docs: payloadProducts } = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1, // Need to expand images to access Media IDs
  })

  console.log(`Found ${payloadProducts.length} payload products.`)

  let updatedCount = 0

  for (const legacyProduct of legacyProducts) {
    const payloadProduct = payloadProducts.find(p => p.slug === legacyProduct.slug)
    
    if (!payloadProduct) {
      console.warn(`Payload product not found for slug: ${legacyProduct.slug}`)
      continue
    }

    if (!legacyProduct.images || legacyProduct.images.length === 0) {
      continue
    }

    const legacyUrls = legacyProduct.images
    const payloadImages = payloadProduct.images || []

    // 3. Update Media items
    for (let i = 0; i < payloadImages.length; i++) {
      if (i >= legacyUrls.length) break // No matching legacy URL

      const mediaDoc = payloadImages[i].image
      const legacyUrl = legacyUrls[i]
      
      // Handle expanded vs ID relationship (depth: 1 should return objects)
      const mediaId = typeof mediaDoc === 'object' ? mediaDoc.id : mediaDoc

      if (mediaId && legacyUrl) {
        try {
            // Check if URL is already set
            if (typeof mediaDoc === 'object' && (mediaDoc as any).url) {
                // console.log(`Media ${mediaId} already has URL. Skipping.`)
                // Optional: Force update if you want to ensure it matches legacy
                // continue 
            }

            await payload.update({
              collection: 'media',
              id: mediaId,
              data: {
                url: legacyUrl,
                alt: legacyProduct.name // Ensure alt text is set
              }
            })
            // console.log(`Updated Media ${mediaId} with URL: ${legacyUrl}`)
            updatedCount++
        } catch (err) {
            console.error(`Failed to update media ${mediaId}:`, err)
        }
      }
    }
  }

  console.log(`Fix complete. Updated ${updatedCount} media items.`)
  process.exit(0)
}

fixMediaUrls()

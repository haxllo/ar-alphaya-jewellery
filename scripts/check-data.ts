
import { getPayload } from 'payload'
import config from './payload-migration.config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkData() {
  const payload = await getPayload({ config })
  
  console.log('Checking Products...')
  const { docs: products, totalDocs } = await payload.find({
    collection: 'products',
    limit: 100,
  })

  console.log(`Total Products: ${totalDocs}`)
  
  for (const p of products) {
    console.log(`Product: ${p.name} (Slug: ${p.slug}) (ID: ${p.id})`)
    const images = p.images || []
    console.log(`  Image Count: ${images.length}`)
    
    for (const imgEntry of images) {
       const mediaId = typeof imgEntry.image === 'object' ? imgEntry.image.id : imgEntry.image
       
       if (mediaId) {
         try {
           const media = await payload.findByID({
             collection: 'media',
             id: mediaId
           })
           console.log(`    Media ID: ${media.id} - URL: ${media.url ? media.url : 'MISSING'}`)
         } catch (e) {
           console.log(`    Media ID: ${mediaId} - NOT FOUND`)
         }
       }
    }
  }

  const { docs: mediaItems } = await payload.find({ collection: 'media', limit: 100 })
  console.log(`Total Media Items: ${mediaItems.length}`)
  mediaItems.forEach(m => console.log(`Media ${m.id}: ${m.url}`))

  process.exit(0)
}

checkData()

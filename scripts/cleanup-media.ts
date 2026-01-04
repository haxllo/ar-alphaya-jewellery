
import { getPayload } from 'payload'
import config from './payload-migration.config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function cleanup() {
  const payload = await getPayload({ config })
  
  console.log('Cleaning up invalid media...')
  
  // Find media with missing URL
  // Note: 'exists' query might not be supported in all adapters, so we fetch all and filter
  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    limit: 1000,
  })

  let deleted = 0
  for (const item of mediaItems) {
    if (!item.url) {
      console.log(`Deleting Media ${item.id} (No URL)`)
      await payload.delete({
        collection: 'media',
        id: item.id
      })
      deleted++
    }
  }

  console.log(`Deleted ${deleted} invalid media items.`)
  process.exit(0)
}

cleanup()

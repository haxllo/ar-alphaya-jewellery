
import { getPayload } from 'payload'
import config from '../src/payload.config'
import 'dotenv/config'

async function run() {
  console.log('Attempting to create first user...')
  try {
    const payload = await getPayload({ config })
    
    // Check if user exists
    const users = await payload.find({
        collection: 'users',
        limit: 1,
    })

    if (users.totalDocs > 0) {
        console.log('User already exists.')
        process.exit(0)
    }

    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@aralphayajewellery.com',
        password: 'password123', // Change this!
      },
    })
    console.log('User created:', user.id)
  } catch (err) {
    console.error('Failed to create user:', err)
  }
  process.exit(0)
}

run()

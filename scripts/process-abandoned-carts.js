#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'abandoned-carts.json')

async function readCarts() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const json = JSON.parse(raw || '{}')
    return Array.isArray(json.carts) ? json.carts : []
  } catch {
    return []
  }
}

async function writeCarts(carts) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const data = { carts }
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

async function processAbandonedCarts() {
  console.log('Processing abandoned carts...')
  
  const carts = await readCarts()
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  
  let processed = 0
  
  for (const cart of carts) {
    if (cart.status !== 'pending') continue
    
    const cartTime = new Date(cart.updatedAt)
    if (cartTime > oneHourAgo) continue // Too recent
    
    try {
      // Call the email sending API
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/abandoned/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id }),
      })
      
      if (response.ok) {
        cart.status = 'emailed'
        cart.emailedAt = now.toISOString()
        processed++
        console.log(`Sent abandoned cart email to ${cart.email}`)
      } else {
        console.error(`Failed to send email for cart ${cart.id}:`, await response.text())
      }
    } catch (error) {
      console.error(`Error processing cart ${cart.id}:`, error)
    }
  }
  
  if (processed > 0) {
    await writeCarts(carts)
    console.log(`Processed ${processed} abandoned carts`)
  } else {
    console.log('No abandoned carts to process')
  }
}

if (require.main === module) {
  processAbandonedCarts().catch(console.error)
}

module.exports = { processAbandonedCarts }

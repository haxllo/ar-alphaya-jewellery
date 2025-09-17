import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { sendAbandonedCartEmail } from '@/lib/email/sender'

type AbandonedCartItem = {
  name: string
  price: number
  quantity: number
  image?: string
}

type AbandonedCart = {
  id: string
  email: string
  status: 'pending' | 'emailed' | string
  items: AbandonedCartItem[]
  emailedAt?: string
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'abandoned-carts.json')

async function readCarts(): Promise<AbandonedCart[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const json = JSON.parse(raw || '{}')
    return Array.isArray(json.carts) ? (json.carts as AbandonedCart[]) : []
  } catch {
    return []
  }
}

async function writeCarts(carts: AbandonedCart[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const data = { carts }
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ENABLE_ABANDONED_CART || process.env.ENABLE_ABANDONED_CART === 'false') {
      return NextResponse.json({ error: 'Abandoned cart disabled' }, { status: 503 })
    }
    const body = await req.json()
    const cartId = body.cartId

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
    }

    const carts = await readCarts()
    const cart = carts.find((c: AbandonedCart) => c.id === cartId)

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    if (cart.status !== 'pending') {
      return NextResponse.json({ error: 'Cart already processed' }, { status: 400 })
    }

    // Format items for email
    const emailItems = cart.items.map((item: AbandonedCartItem) => ({
      name: item.name,
      price: `LKR ${item.price.toLocaleString()}`,
      quantity: item.quantity,
      image: item.image,
    }))

    // Send email
    const result = await sendAbandonedCartEmail(cart.email, emailItems)

    if (result.success) {
      cart.status = 'emailed'
      cart.emailedAt = new Date().toISOString()
      await writeCarts(carts)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: result.id 
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Abandoned cart email error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

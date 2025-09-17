import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

interface AbandonedCartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface AbandonedCartRecord {
  id: string
  email: string
  items: AbandonedCartItem[]
  createdAt: string
  updatedAt: string
  status: 'pending' | 'emailed' | 'dismissed'
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'abandoned-carts.json')

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ carts: [] }, null, 2), 'utf8')
  }
}

async function readCarts(): Promise<AbandonedCartRecord[]> {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  const json = JSON.parse(raw || '{}')
  return Array.isArray(json.carts) ? json.carts : []
}

async function writeCarts(carts: AbandonedCartRecord[]) {
  await ensureDataFile()
  const data = { carts }
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ENABLE_ABANDONED_CART || process.env.ENABLE_ABANDONED_CART === 'false') {
      return NextResponse.json({ error: 'Abandoned cart disabled' }, { status: 503 })
    }
    const body = await req.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const items = Array.isArray(body?.items) ? body.items as AbandonedCartItem[] : []

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const carts = await readCarts()

    // Upsert by email (one open cart per email)
    const existingIndex = carts.findIndex(c => c.email === email && c.status === 'pending')
    if (existingIndex >= 0) {
      carts[existingIndex] = {
        ...carts[existingIndex],
        items,
        updatedAt: now,
      }
    } else {
      carts.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        email,
        items,
        createdAt: now,
        updatedAt: now,
        status: 'pending',
      })
    }

    await writeCarts(carts)
    const res = NextResponse.json({ success: true })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function GET() {
  if (!process.env.ENABLE_ABANDONED_CART || process.env.ENABLE_ABANDONED_CART === 'false') {
    return NextResponse.json({ error: 'Abandoned cart disabled' }, { status: 503 })
  }
  // For debugging only; do not expose in production
  const carts = await readCarts()
  return NextResponse.json({ carts })
}



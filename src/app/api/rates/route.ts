import { NextRequest, NextResponse } from 'next/server'

// Cache rates in-memory for this serverless instance
let cachedRates: { data: Record<string, number>, timestamp: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000 // 60 minutes

export async function GET(_request: NextRequest) {
  try {
    const now = Date.now()

    if (cachedRates && (now - cachedRates.timestamp) < CACHE_TTL_MS) {
      const res = NextResponse.json({ base: 'LKR', rates: cachedRates.data, cached: true })
      res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
      return res
    }

    // Use exchangerate.host (free, no key) with base LKR
    const url = 'https://api.exchangerate.host/latest?base=LKR'
    const resp = await fetch(url, { next: { revalidate: 3600 } })
    if (!resp.ok) {
      return NextResponse.json({ error: 'Failed to fetch exchange rates' }, { status: 502 })
    }
    const json = await resp.json()

    // Normalize: keep only needed currencies if desired, but return all for flexibility
    const rates: Record<string, number> = json.rates || {}

    cachedRates = { data: rates, timestamp: now }

    const res = NextResponse.json({ base: 'LKR', rates, cached: false })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    return res
  } catch (error) {
    console.error('Rates API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



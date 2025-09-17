import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, slug, email } = body || {}
    if (!productId || !email) {
      return NextResponse.json({ success: false, error: 'productId and email are required' }, { status: 400 })
    }

    // TODO: Persist to database or mailing service. For now, log only.
    console.log('Back-in-stock waitlist:', { productId, slug, email, ts: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 })
  }
}



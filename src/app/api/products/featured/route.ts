import { NextRequest, NextResponse } from 'next/server'
import { getFeaturedProducts } from '@/lib/cms'

/**
 * GET /api/products/featured
 * Public API - Get featured products using Payload CMS
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4
    
    const products = await getFeaturedProducts(limit)
    
    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error('Error in GET /api/products/featured:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}

// Enable caching
export const revalidate = 60

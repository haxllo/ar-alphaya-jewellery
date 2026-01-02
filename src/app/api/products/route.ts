import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/cms'

/**
 * GET /api/products
 * Public API - Get published products using Payload CMS
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const search = searchParams.get('search') || undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    
    const result = await searchProducts({
      category,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      limit,
      query: search,
      page
    })
    
    return NextResponse.json({ 
      products: result.products,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    })
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// Enable caching
export const revalidate = 60

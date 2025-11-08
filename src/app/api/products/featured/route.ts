import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/products/featured
 * Public API - Get featured products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '4'
    
    const supabase = createServerClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
    
    if (error) {
      throw error
    }
    
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

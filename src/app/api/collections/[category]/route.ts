import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/collections/[category]
 * Public API - Get products by category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    
    const supabase = createServerClient()
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const { data: products, error } = await query
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ 
      products: products || [],
      category 
    })
  } catch (error) {
    console.error('Error in GET /api/collections/[category]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection products' },
      { status: 500 }
    )
  }
}

// Enable caching
export const revalidate = 60

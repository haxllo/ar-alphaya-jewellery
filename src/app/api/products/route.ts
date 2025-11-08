import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/products
 * Public API - Get published products
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')
    
    const supabase = createServerClient()
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const { data: products, error } = await query
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// Enable caching
export const revalidate = 60 // Revalidate every 60 seconds

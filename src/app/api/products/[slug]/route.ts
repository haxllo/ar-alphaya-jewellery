import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/cms'

/**
 * GET /api/products/[slug]
 * Public API - Get single product by slug using Payload CMS
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in GET /api/products/[slug]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// Enable caching
export const revalidate = 60

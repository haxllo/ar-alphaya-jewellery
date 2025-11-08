import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getProductById, updateProduct, deleteProduct } from '@/lib/admin/products'

/**
 * GET /api/admin/products/[id]
 * Get single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const product = await getProductById(id)
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 404 }
    )
  }
}

/**
 * PATCH /api/admin/products/[id]
 * Update product
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const body = await request.json()
    const product = await updateProduct(id, body, session.user.id)
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in PATCH /api/admin/products/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 400 }
    )
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    await deleteProduct(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/products/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 400 }
    )
  }
}

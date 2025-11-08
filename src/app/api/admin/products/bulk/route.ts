import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { bulkDeleteProducts, bulkUpdateStatus } from '@/lib/admin/products'

/**
 * POST /api/admin/products/bulk
 * Bulk operations on products
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { action, ids } = body
    
    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request. Provide action and ids array' },
        { status: 400 }
      )
    }
    
    switch (action) {
      case 'delete':
        await bulkDeleteProducts(ids)
        return NextResponse.json({ success: true, message: `Deleted ${ids.length} products` })
      
      case 'publish':
        await bulkUpdateStatus(ids, 'published', session.user.id)
        return NextResponse.json({ success: true, message: `Published ${ids.length} products` })
      
      case 'draft':
        await bulkUpdateStatus(ids, 'draft', session.user.id)
        return NextResponse.json({ success: true, message: `Moved ${ids.length} products to draft` })
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in POST /api/admin/products/bulk:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bulk operation failed' },
      { status: 400 }
    )
  }
}

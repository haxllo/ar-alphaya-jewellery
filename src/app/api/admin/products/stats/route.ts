import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { checkIsAdmin } from '@/lib/admin-auth'
import { getProductStats } from '@/lib/admin/products'

/**
 * GET /api/admin/products/stats
 * Get product statistics for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkIsAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const stats = await getProductStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in GET /api/admin/products/stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

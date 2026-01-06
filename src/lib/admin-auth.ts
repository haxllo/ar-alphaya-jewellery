import { createServerClient } from '@/lib/supabase'

/**
 * Check if a user is an active admin
 * Uses the service role client to bypass RLS and query the admin_users table directly
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
      
    if (error || !data) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

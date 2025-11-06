import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const checks: Record<string, any> = {}

    // Check environment variables
    checks.env = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      AUTH_SECRET: process.env.AUTH_SECRET ? '✅ Set' : '❌ Missing',
    }

    // Test Supabase connection
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from('users').select('count').limit(1)
      checks.supabase = {
        connection: error ? '❌ Error' : '✅ Connected',
        error: error?.message,
      }
    } catch (err) {
      checks.supabase = {
        connection: '❌ Failed',
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }

    // Check database tables
    try {
      const supabase = createServerClient()
      const tables = ['users', 'sessions', 'accounts', 'verificationTokens']
      const tableChecks: Record<string, string> = {}
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(0)
          tableChecks[table] = error ? '❌ Error' : '✅ Exists'
        } catch {
          tableChecks[table] = '❌ Not found'
        }
      }
      checks.tables = tableChecks
    } catch (err) {
      checks.tables = { error: err instanceof Error ? err.message : 'Unknown error' }
    }

    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

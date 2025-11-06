import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, any> = {}

  try {
    // Test 1: Environment variables
    diagnostics.env = {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌',
      AUTH_SECRET: process.env.AUTH_SECRET ? '✅' : '❌',
      AUTH_URL: process.env.AUTH_URL || '❌ Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not set',
    }

    // Test 2: Supabase connection
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from('users').select('count').limit(1)
      diagnostics.supabase = {
        connected: error ? '❌' : '✅',
        error: error?.message,
      }
    } catch (err) {
      diagnostics.supabase = {
        connected: '❌',
        error: err instanceof Error ? err.message : 'Unknown',
      }
    }

    // Test 3: Try importing NextAuth
    try {
      const NextAuth = (await import('next-auth')).default
      diagnostics.nextauth = { import: '✅' }
    } catch (err) {
      diagnostics.nextauth = {
        import: '❌',
        error: err instanceof Error ? err.message : 'Unknown',
      }
    }

    // Test 4: Try importing adapter
    try {
      const { SupabaseAdapter } = await import('@auth/supabase-adapter')
      diagnostics.adapter = { import: '✅' }
      
      // Try to instantiate adapter
      try {
        const adapter = SupabaseAdapter({
          url: process.env.SUPABASE_URL!,
          secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        })
        diagnostics.adapter.instantiate = '✅'
      } catch (err) {
        diagnostics.adapter.instantiate = '❌'
        diagnostics.adapter.instantiateError = err instanceof Error ? err.message : 'Unknown'
      }
    } catch (err) {
      diagnostics.adapter = {
        import: '❌',
        error: err instanceof Error ? err.message : 'Unknown',
      }
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}


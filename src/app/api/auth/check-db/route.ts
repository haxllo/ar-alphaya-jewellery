import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const checks: Record<string, any> = {}

  try {
    const supabase = createServerClient()

    // Check if tables exist and have correct structure
    const tables = ['users', 'sessions', 'accounts', 'verificationTokens']
    
    for (const table of tables) {
      try {
        // Try to query the table structure
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(0)
        
        if (error) {
          checks[table] = {
            exists: '❌',
            error: error.message,
            code: error.code,
          }
        } else {
          // Table exists, check columns
          const { data: columns, error: colError } = await supabase
            .rpc('get_table_columns', { table_name: table })
            .single()
          
          checks[table] = {
            exists: '✅',
            accessible: '✅',
            columns: colError ? 'Could not check columns' : '✅',
          }
        }
      } catch (err) {
        checks[table] = {
          exists: '❓',
          error: err instanceof Error ? err.message : 'Unknown error',
        }
      }
    }

    // Test adapter connection by trying to create a test query
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .limit(1)
      
      checks.adapterConnection = {
        status: error ? '❌' : '✅',
        error: error?.message,
      }
    } catch (err) {
      checks.adapterConnection = {
        status: '❌',
        error: err instanceof Error ? err.message : 'Unknown',
      }
    }

    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Database check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}


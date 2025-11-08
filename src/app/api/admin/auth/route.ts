import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // This endpoint handles the OAuth callback for Decap CMS
  // It's protected by HTTP Basic Auth via middleware
  
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider')
  
  if (provider !== 'github') {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  // Return GitHub token from environment
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error('GITHUB_TOKEN not configured')
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    )
  }

  // Return the token in the format Decap CMS expects
  return NextResponse.json({
    token,
    provider: 'github',
  })
}

export async function POST(request: NextRequest) {
  // Handle POST requests (used during OAuth flow)
  return GET(request)
}

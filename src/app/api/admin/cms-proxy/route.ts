import { NextRequest, NextResponse } from 'next/server'

// Git Gateway compatible proxy for Decap CMS
// Protected by HTTP Basic Auth middleware
// Routes requests to GitHub API with server-side token

const REPO = 'haxllo/ar-alphaya-jewellery'
const BRANCH = 'main'

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    )
  }

  const url = new URL(request.url)
  const action = url.searchParams.get('action')

  try {
    const body = await request.json()

    switch (action) {
      case 'info':
        // Return basic repo info
        return NextResponse.json({
          repo: REPO,
          branch: BRANCH,
        })

      case 'entriesByFolder':
        return await getEntriesByFolder(token, body)

      case 'entry':
        return await getEntry(token, body)

      case 'persistEntry':
        return await persistEntry(token, body)

      case 'deleteEntry':
        return await deleteEntry(token, body)

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('CMS Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function githubRequest(token: string, path: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.github.com/${path}`, {
    ...options,
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GitHub API error: ${response.status} - ${error}`)
  }

  return response.json()
}

async function getEntriesByFolder(token: string, params: any) {
  const { folder, extension } = params
  const files = await githubRequest(token, `repos/${REPO}/contents/${folder}`)
  
  const filtered = files.filter((file: any) => 
    file.name.endsWith(`.${extension}`)
  )
  
  return NextResponse.json(filtered)
}

async function getEntry(token: string, params: any) {
  const { path } = params
  const file = await githubRequest(token, `repos/${REPO}/contents/${path}`)
  
  return NextResponse.json({
    file,
    data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8')),
  })
}

async function persistEntry(token: string, params: any) {
  const { path, raw, sha } = params
  
  const payload: any = {
    message: params.commitMessage || `Update ${path}`,
    content: Buffer.from(raw).toString('base64'),
    branch: BRANCH,
  }
  
  if (sha) {
    payload.sha = sha
  }
  
  const result = await githubRequest(token, `repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  
  return NextResponse.json(result)
}

async function deleteEntry(token: string, params: any) {
  const { path, sha } = params
  
  const result = await githubRequest(token, `repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message: `Delete ${path}`,
      sha,
      branch: BRANCH,
    }),
  })
  
  return NextResponse.json(result)
}

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = 'haxllo'
const REPO_NAME = 'ar-alphaya-jewellery'
const BRANCH = 'main'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const materials = formData.get('materials') as string
    const weight = formData.get('weight') as string
    const dimensions = formData.get('dimensions') as string
    const description = formData.get('description') as string
    
    // Get uploaded images
    const images = formData.getAll('images') as File[]
    
    // Validate required fields
    if (!id || !name || !slug || !price || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // For now, we'll create the product without images and provide instructions
    // This avoids the complexity of GitHub API file uploads for images
    
    // Parse materials
    const materialsArray = materials ? materials.split('\n').filter(m => m.trim()) : []
    
    // Generate frontmatter (using placeholder images for now)
    const imagePaths = images.length > 0 
      ? Array.from({length: images.length}, (_, i) => `/images/products/${slug}-${i + 1}.jpg`)
      : ['/images/placeholders/placeholder-1.jpg']
    
    const frontmatter = `---
id: "${id}"
slug: "${slug}"
name: "${name}"
price: ${parseInt(price)}
currency: "LKR"
images:
${imagePaths.map(path => `  - "${path}"`).join('\n')}
category: "${category}"
materials:
${materialsArray.map(material => `  - "${material.trim()}"`).join('\n')}
${weight ? `weight: ${parseFloat(weight)}` : ''}
${dimensions ? `dimensions: "${dimensions}"` : ''}
inStock: true
featured: false
tags:
  - "new"
  - "${category}"
createdAt: "${new Date().toISOString()}"
updatedAt: "${new Date().toISOString()}"
---

${description}`
    
    // Create the product file via GitHub API if token is available
    if (GITHUB_TOKEN) {
      try {
        const fileContent = Buffer.from(frontmatter).toString('base64')
        const filePath = `src/data/products/${slug}.md`
        
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add product: ${name}`,
            content: fileContent,
            branch: BRANCH
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`GitHub API error: ${errorData.message || response.statusText}`)
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Product created successfully and deployed to GitHub!',
          productId: id,
          slug: slug,
          images: imagePaths,
          needsImages: images.length > 0,
          githubCreated: true
        })
      } catch (githubError) {
        console.error('GitHub API error:', githubError)
        // Fall through to manual creation response
      }
    }
    
    // Fallback: provide the markdown for manual creation
    return NextResponse.json({ 
      success: true, 
      message: 'Product template created. Manual setup required.',
      productId: id,
      slug: slug,
      markdown: frontmatter,
      images: imagePaths,
      needsImages: images.length > 0,
      githubCreated: false,
      instructions: {
        step1: `Create file: src/data/products/${slug}.md`,
        step2: 'Copy the markdown content provided',
        step3: images.length > 0 ? `Upload ${images.length} images to public/images/products/` : 'No images to upload',
        step4: 'Commit changes to trigger site rebuild'
      }
    })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ 
      error: 'Failed to create product', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

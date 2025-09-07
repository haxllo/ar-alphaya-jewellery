import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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
    
    // Ensure directories exist
    const productsDir = path.join(process.cwd(), 'src', 'data', 'products')
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')
    
    if (!existsSync(productsDir)) {
      await mkdir(productsDir, { recursive: true })
    }
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true })
    }
    
    // Process and save images
    const imagePaths: string[] = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (image.size > 0) {
        const fileExtension = image.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${slug}-${i + 1}.${fileExtension}`
        const filePath = path.join(imagesDir, fileName)
        
        const buffer = await image.arrayBuffer()
        await writeFile(filePath, new Uint8Array(buffer))
        
        imagePaths.push(`/images/products/${fileName}`)
      }
    }
    
    // Parse materials
    const materialsArray = materials ? materials.split('\n').filter(m => m.trim()) : []
    
    // Generate frontmatter
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
    
    // Write product file
    const productFilePath = path.join(productsDir, `${slug}.md`)
    await writeFile(productFilePath, frontmatter)
    
    // Trigger rebuild (in production, this would trigger Netlify rebuild)
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      productId: id,
      slug: slug,
      images: imagePaths
    })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ 
      error: 'Failed to create product', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Product, Collection } from '@/types/product'

const contentDir = path.join(process.cwd(), 'src', 'data')

export function getAllCollections(): Collection[] {
  const file = path.join(contentDir, 'collections.json')
  if (!fs.existsSync(file)) return []
  const data = JSON.parse(fs.readFileSync(file, 'utf-8')) as Collection[]
  return data
}

export function getAllProducts(): Product[] {
  const dir = path.join(contentDir, 'products')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  return files.map((filename) => {
    const filePath = path.join(dir, filename)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(file)
    return {
      id: String(data.id),
      slug: String(data.slug),
      name: String(data.name),
      description: content || String(data.description || ''),
      price: Number(data.price || 0),
      currency: data.currency || 'LKR',
      images: Array.isArray(data.images) ? data.images : [],
      category: String(data.category || 'uncategorized'),
      sku: data.sku || undefined,
      materials: Array.isArray(data.materials) ? data.materials : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      inStock: data.inStock ?? true,
      featured: data.featured ?? false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: data.createdAt || undefined,
      updatedAt: data.updatedAt || undefined,
    } as Product
  })
}

export function getProductBySlug(slug: string): Product | null {
  return getAllProducts().find((p) => p.slug === slug) || null
}

export function getProductsByCollection(handle: string): Product[] {
  return getAllProducts().filter((p) => p.category === handle)
}


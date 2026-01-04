
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const Media = {
  slug: 'media',
  fields: [
    { name: 'url', type: 'text' },
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'textarea' },
  ],
}

const Products = {
  slug: 'products',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText', required: true },
    { name: 'price', type: 'number', required: true, min: 0 },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'LKR',
      options: [
        { label: 'LKR', value: 'LKR' },
        { label: 'USD', value: 'USD' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Rings', value: 'rings' },
        { label: 'Earrings', value: 'earrings' },
        { label: 'Pendants', value: 'pendants' },
        { label: 'Bracelets & Bangles', value: 'bracelets-bangles' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    { name: 'sku', type: 'text' },
    {
      name: 'materials',
      type: 'select',
      hasMany: true,
      options: [
        { label: '925 Silver', value: 'silver' },
        { label: '18K Gold', value: 'gold-18k' },
        { label: '24K Gold', value: 'gold-24k' },
        { label: 'Rose Gold', value: 'rose-gold' },
        { label: 'Platinum', value: 'platinum' },
      ],
    },
    { name: 'weight', type: 'number' },
    { name: 'dimensions', type: 'text' },
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
      ],
    },
    {
      name: 'gemstones',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'priceAdjustment', type: 'number', defaultValue: 0 },
        { name: 'description', type: 'textarea' },
        { name: 'available', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'inStock', type: 'checkbox', defaultValue: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'availability', type: 'text' },
    { name: 'leadTime', type: 'text' },
    { name: 'customizable', type: 'checkbox', defaultValue: false },
    { name: 'statusNote', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}

const Users = {
  slug: 'users',
  auth: true,
  fields: [],
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Users, Media, Products] as any,
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'temp-secret-for-migration',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL,
    },
    schemaName: 'payload',
  }),
  sharp,
})

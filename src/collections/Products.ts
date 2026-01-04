import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'inStock'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used for the product URL',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
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
    {
      name: 'sku',
      type: 'text',
    },
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
    {
      name: 'weight',
      type: 'number',
      admin: {
        description: 'Weight in grams',
      },
    },
    {
      name: 'dimensions',
      type: 'text',
    },
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
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'priceAdjustment',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'availability',
      type: 'text',
      admin: {
        placeholder: 'e.g. In Stock, Pre-order',
      },
    },
    {
      name: 'leadTime',
      type: 'text',
      admin: {
        placeholder: 'e.g. 2-3 weeks',
      },
    },
    {
      name: 'customizable',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'statusNote',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

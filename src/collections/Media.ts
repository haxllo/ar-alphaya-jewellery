import type { CollectionConfig } from 'payload'
import { UploadcareField } from '@/components/admin/UploadcareField'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: false,
      admin: {
        components: {
          Field: UploadcareField as any,
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}

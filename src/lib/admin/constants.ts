// Admin Panel Constants

export const PRODUCT_CATEGORIES = [
  { value: 'rings', label: 'Rings' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'pendants', label: 'Pendants' },
  { value: 'bracelets-bangles', label: 'Bracelets & Bangles' }
] as const

export const PRODUCT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray', description: 'Not visible to customers' },
  { value: 'published', label: 'Published', color: 'green', description: 'Visible on website' }
] as const

export const MATERIALS = [
  'Gold',
  'Silver',
  'Platinum',
  'Rose Gold',
  'White Gold',
  'Yellow Gold',
  '18K Gold',
  '22K Gold',
  'Stainless Steel',
  'Titanium',
  'Diamond',
  'Pearl',
  'Gemstone'
] as const

export const COMMON_TAGS = [
  'Wedding',
  'Engagement',
  'Anniversary',
  'Birthday',
  'Everyday',
  'Special Occasion',
  'Bridal',
  'Vintage',
  'Modern',
  'Classic',
  'Minimalist',
  'Statement',
  'Custom Design',
  'Limited Edition'
] as const

export const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Newest First', sortBy: 'created_at', sortOrder: 'desc' },
  { value: 'created_at-asc', label: 'Oldest First', sortBy: 'created_at', sortOrder: 'asc' },
  { value: 'name-asc', label: 'Name (A-Z)', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name-desc', label: 'Name (Z-A)', sortBy: 'name', sortOrder: 'desc' },
  { value: 'price-asc', label: 'Price (Low to High)', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Price (High to Low)', sortBy: 'price', sortOrder: 'desc' }
] as const

export const ITEMS_PER_PAGE = 20

export const CURRENCIES = [
  { code: 'LKR', symbol: 'Rs.', name: 'Sri Lankan Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
] as const

export const MAX_IMAGES = 10
export const MAX_DESCRIPTION_LENGTH = 5000
export const MAX_NAME_LENGTH = 255

export const AVAILABILITY_OPTIONS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'made-to-order', label: 'Made to Order' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'pre-order', label: 'Pre-Order' },
  { value: 'discontinued', label: 'Discontinued' }
] as const

export const GEMSTONE_TYPES = [
  'Sapphire',
  'Ruby',
  'Emerald',
  'Topaz',
  'Amethyst',
  'Garnet',
  'Aquamarine',
  'Tourmaline',
  'Citrine',
  'Peridot',
  'Moonstone',
  'Opal',
  'Tanzanite',
  'Spinel',
  'Zircon'
] as const

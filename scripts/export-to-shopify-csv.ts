/**
 * Export products from Supabase to Shopify CSV format
 * Run: npx tsx scripts/export-to-shopify-csv.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Product {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sku: string;
  materials: string[];
  tags: string[];
  weight: number;
  dimensions: string;
  sizes: Array<{ label: string; value: string }>;
  gemstones: Array<{
    name: string;
    value: string;
    priceAdjustment?: number;
    description?: string;
    available?: boolean;
  }>;
  in_stock: boolean;
  featured: boolean;
  status: string;
  availability: string;
  lead_time: string;
  customizable: boolean;
  status_note: string;
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function convertPriceToShopify(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

async function exportToShopifyCSV() {
  console.log('Fetching products from Supabase...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log('No products found in database.');
    process.exit(0);
  }

  console.log(`Found ${products.length} products. Converting to Shopify format...`);

  // Shopify CSV headers
  const headers = [
    'Title',
    'URL handle',
    'Description',
    'Vendor',
    'Product category',
    'Type',
    'Tags',
    'Published on online store',
    'Status',
    'SKU',
    'Barcode',
    'Option1 name',
    'Option1 value',
    'Option2 name',
    'Option2 value',
    'Option3 name',
    'Option3 value',
    'Price',
    'Compare-at price',
    'Cost per item',
    'Charge tax',
    'Tax code',
    'Unit price total measure',
    'Unit price total measure unit',
    'Unit price base measure',
    'Unit price base measure unit',
    'Inventory tracker',
    'Inventory quantity',
    'Continue selling when out of stock',
    'Weight value (grams)',
    'Weight unit for display',
    'Requires shipping',
    'Fulfillment service',
    'Product image URL',
    'Image position',
    'Image alt text',
    'Variant image URL',
    'Gift card',
    'SEO title',
    'SEO description',
    'Google Shopping / Google product category',
    'Google Shopping / Gender',
    'Google Shopping / Age group',
    'Google Shopping / MPN',
    'Google Shopping / AdWords Grouping',
    'Google Shopping / AdWords labels',
    'Google Shopping / Condition',
    'Google Shopping / Custom product',
    'Google Shopping / Custom label 0',
    'Google Shopping / Custom label 1',
    'Google Shopping / Custom label 2',
    'Google Shopping / Custom label 3',
    'Google Shopping / Custom label 4',
  ];

  const rows: string[][] = [headers];

  products.forEach((product: Product) => {
    const basePrice = convertPriceToShopify(product.price);
    const tags = [...(product.tags || []), ...(product.materials || [])].join(', ');
    const shopifyStatus = product.status === 'published' ? 'active' : 'draft';
    const vendor = 'AR Alphaya Jewellery';
    const productCategory = 'Apparel & Accessories > Jewelry';
    
    // Determine if product has variants
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasGemstones = product.gemstones && product.gemstones.length > 0;
    const hasVariants = hasSizes || hasGemstones;

    if (!hasVariants) {
      // Single product without variants
      const row = [
        escapeCSV(product.name), // Title
        escapeCSV(product.slug), // URL handle
        escapeCSV(product.description), // Description
        escapeCSV(vendor), // Vendor
        escapeCSV(productCategory), // Product category
        escapeCSV(product.category), // Type
        escapeCSV(tags), // Tags
        'TRUE', // Published on online store
        escapeCSV(shopifyStatus), // Status
        escapeCSV(product.sku || product.product_id), // SKU
        '', // Barcode
        '', // Option1 name
        '', // Option1 value
        '', // Option2 name
        '', // Option2 value
        '', // Option3 name
        '', // Option3 value
        escapeCSV(basePrice), // Price
        '', // Compare-at price
        '', // Cost per item
        'TRUE', // Charge tax
        '', // Tax code
        '', // Unit price total measure
        '', // Unit price total measure unit
        '', // Unit price base measure
        '', // Unit price base measure unit
        'shopify', // Inventory tracker
        product.in_stock ? '100' : '0', // Inventory quantity
        'deny', // Continue selling when out of stock
        escapeCSV(product.weight || ''), // Weight value (grams)
        'g', // Weight unit for display
        'TRUE', // Requires shipping
        'manual', // Fulfillment service
        escapeCSV(product.images?.[0] || ''), // Product image URL
        '1', // Image position
        escapeCSV(product.name), // Image alt text
        '', // Variant image URL
        'FALSE', // Gift card
        escapeCSV(product.name), // SEO title
        escapeCSV(product.description?.substring(0, 320)), // SEO description
        escapeCSV(productCategory), // Google Shopping / Google product category
        'Unisex', // Google Shopping / Gender
        'Adult', // Google Shopping / Age group
        escapeCSV(product.sku || ''), // Google Shopping / MPN
        escapeCSV(product.category), // Google Shopping / AdWords Grouping
        escapeCSV(tags), // Google Shopping / AdWords labels
        'new', // Google Shopping / Condition
        'FALSE', // Google Shopping / Custom product
        '', // Google Shopping / Custom label 0
        '', // Google Shopping / Custom label 1
        '', // Google Shopping / Custom label 2
        '', // Google Shopping / Custom label 3
        '', // Google Shopping / Custom label 4
      ];
      rows.push(row);

      // Add additional image rows
      if (product.images && product.images.length > 1) {
        product.images.slice(1).forEach((imageUrl, index) => {
          const imageRow = Array(headers.length).fill('');
          imageRow[1] = escapeCSV(product.slug); // URL handle
          imageRow[33] = escapeCSV(imageUrl); // Product image URL
          imageRow[34] = String(index + 2); // Image position
          imageRow[35] = escapeCSV(product.name); // Image alt text
          rows.push(imageRow);
        });
      }
    } else {
      // Product with variants
      const sizes = hasSizes ? product.sizes : [{ label: 'Default', value: 'default' }];
      const gemstones = hasGemstones ? product.gemstones : [{ name: 'None', value: 'none', priceAdjustment: 0 }];

      let isFirstVariant = true;
      let imageIndex = 0;

      sizes.forEach((size) => {
        gemstones.forEach((gemstone) => {
          const variantPrice = product.price + (gemstone.priceAdjustment || 0);
          const variantPriceFormatted = convertPriceToShopify(variantPrice);
          const variantSKU = `${product.sku || product.product_id}-${size.value}-${gemstone.value}`.toUpperCase();

          const row = [
            isFirstVariant ? escapeCSV(product.name) : '', // Title (only first row)
            escapeCSV(product.slug), // URL handle
            isFirstVariant ? escapeCSV(product.description) : '', // Description (only first row)
            isFirstVariant ? escapeCSV(vendor) : '', // Vendor
            isFirstVariant ? escapeCSV(productCategory) : '', // Product category
            isFirstVariant ? escapeCSV(product.category) : '', // Type
            isFirstVariant ? escapeCSV(tags) : '', // Tags
            isFirstVariant ? 'TRUE' : '', // Published on online store
            isFirstVariant ? escapeCSV(shopifyStatus) : '', // Status
            escapeCSV(variantSKU), // SKU
            '', // Barcode
            hasSizes ? 'Size' : '', // Option1 name
            hasSizes ? escapeCSV(size.label) : '', // Option1 value
            hasGemstones ? 'Gemstone' : '', // Option2 name
            hasGemstones ? escapeCSV(gemstone.name) : '', // Option2 value
            '', // Option3 name
            '', // Option3 value
            escapeCSV(variantPriceFormatted), // Price
            '', // Compare-at price
            '', // Cost per item
            'TRUE', // Charge tax
            '', // Tax code
            '', // Unit price total measure
            '', // Unit price total measure unit
            '', // Unit price base measure
            '', // Unit price base measure unit
            'shopify', // Inventory tracker
            product.in_stock && (gemstone.available !== false) ? '100' : '0', // Inventory quantity
            'deny', // Continue selling when out of stock
            escapeCSV(product.weight || ''), // Weight value (grams)
            'g', // Weight unit for display
            'TRUE', // Requires shipping
            'manual', // Fulfillment service
            isFirstVariant && product.images?.[0] ? escapeCSV(product.images[0]) : '', // Product image URL
            isFirstVariant && product.images?.[0] ? '1' : '', // Image position
            isFirstVariant && product.images?.[0] ? escapeCSV(product.name) : '', // Image alt text
            '', // Variant image URL
            'FALSE', // Gift card
            isFirstVariant ? escapeCSV(product.name) : '', // SEO title
            isFirstVariant ? escapeCSV(product.description?.substring(0, 320)) : '', // SEO description
            isFirstVariant ? escapeCSV(productCategory) : '', // Google Shopping / Google product category
            isFirstVariant ? 'Unisex' : '', // Google Shopping / Gender
            isFirstVariant ? 'Adult' : '', // Google Shopping / Age group
            isFirstVariant ? escapeCSV(product.sku || '') : '', // Google Shopping / MPN
            isFirstVariant ? escapeCSV(product.category) : '', // Google Shopping / AdWords Grouping
            isFirstVariant ? escapeCSV(tags) : '', // Google Shopping / AdWords labels
            isFirstVariant ? 'new' : '', // Google Shopping / Condition
            isFirstVariant ? 'FALSE' : '', // Google Shopping / Custom product
            '', // Google Shopping / Custom label 0
            '', // Google Shopping / Custom label 1
            '', // Google Shopping / Custom label 2
            '', // Google Shopping / Custom label 3
            '', // Google Shopping / Custom label 4
          ];
          rows.push(row);
          isFirstVariant = false;
        });
      });

      // Add additional image rows
      if (product.images && product.images.length > 1) {
        product.images.slice(1).forEach((imageUrl, index) => {
          const imageRow = Array(headers.length).fill('');
          imageRow[1] = escapeCSV(product.slug); // URL handle
          imageRow[33] = escapeCSV(imageUrl); // Product image URL
          imageRow[34] = String(index + 2); // Image position
          imageRow[35] = escapeCSV(product.name); // Image alt text
          rows.push(imageRow);
        });
      }
    }
  });

  // Convert rows to CSV string
  const csvContent = rows.map((row) => row.join(',')).join('\n');

  // Write to file
  const outputPath = join(process.cwd(), 'shopify-products-export.csv');
  writeFileSync(outputPath, csvContent, 'utf-8');

  console.log(`✅ Successfully exported ${products.length} products to: ${outputPath}`);
  console.log(`Total rows (including variants and images): ${rows.length - 1}`);
  console.log('\nNext steps:');
  console.log('1. Review the CSV file: shopify-products-export.csv');
  console.log('2. Go to Shopify Admin → Products → Import');
  console.log('3. Upload the CSV file');
  console.log('4. Review and confirm the import');
}

exportToShopifyCSV().catch((error) => {
  console.error('Export failed:', error);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function convertPriceToShopify(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get query parameters for selected product IDs
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    const selectedIds = idsParam ? idsParam.split(',') : null;

    // Build query based on whether specific IDs are requested
    let query = supabase.from('products').select('*');
    
    if (selectedIds && selectedIds.length > 0) {
      query = query.in('id', selectedIds);
    }
    
    const { data: products, error } = await query.order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 });
    }

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
    const vendor = 'AR Alphaya Jewellery';
    const productCategory = 'Apparel & Accessories > Jewelry';

    products.forEach((product: Product) => {
      const basePrice = convertPriceToShopify(product.price);
      const tags = [...(product.tags || []), ...(product.materials || [])].join(', ');
      const shopifyStatus = product.status === 'published' ? 'active' : 'draft';

      const hasSizes = product.sizes && product.sizes.length > 0;
      const hasGemstones = product.gemstones && product.gemstones.length > 0;
      const hasVariants = hasSizes || hasGemstones;

      if (!hasVariants) {
        // Single product without variants - leave Option columns blank for default
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
          '', // Option1 name - blank for non-variant products
          '', // Option1 value - blank for non-variant products
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

        // Additional images
        if (product.images && product.images.length > 1) {
          product.images.slice(1).forEach((imageUrl, index) => {
            const imageRow = Array(headers.length).fill('');
            imageRow[1] = escapeCSV(product.slug);
            imageRow[33] = escapeCSV(imageUrl);
            imageRow[34] = String(index + 2);
            imageRow[35] = escapeCSV(product.name);
            rows.push(imageRow);
          });
        }
      } else {
        // Product with variants
        const sizes = hasSizes ? product.sizes : [{ label: 'Default', value: 'default' }];
        const gemstones = hasGemstones ? product.gemstones : [{ name: 'None', value: 'none', priceAdjustment: 0 }];

        let isFirstVariant = true;

        sizes.forEach((size) => {
          gemstones.forEach((gemstone) => {
            const variantPrice = product.price + (gemstone.priceAdjustment || 0);
            const variantPriceFormatted = convertPriceToShopify(variantPrice);
            const variantSKU = `${product.sku || product.product_id}-${size.value}-${gemstone.value}`.toUpperCase();

            const row = [
              isFirstVariant ? escapeCSV(product.name) : '',
              escapeCSV(product.slug),
              isFirstVariant ? escapeCSV(product.description) : '',
              isFirstVariant ? escapeCSV(vendor) : '',
              isFirstVariant ? escapeCSV(productCategory) : '',
              isFirstVariant ? escapeCSV(product.category) : '',
              isFirstVariant ? escapeCSV(tags) : '',
              isFirstVariant ? 'TRUE' : '',
              isFirstVariant ? escapeCSV(shopifyStatus) : '',
              escapeCSV(variantSKU),
              '',
              hasSizes ? 'Size' : '',
              hasSizes ? escapeCSV(size.label) : '',
              hasGemstones ? 'Gemstone' : '',
              hasGemstones ? escapeCSV(gemstone.name) : '',
              '', '',
              escapeCSV(variantPriceFormatted),
              '', '',
              'TRUE',
              '', '', '', '', '',
              'shopify',
              product.in_stock && (gemstone.available !== false) ? '100' : '0',
              'deny',
              escapeCSV(product.weight || ''),
              'g',
              'TRUE',
              'manual',
              isFirstVariant && product.images?.[0] ? escapeCSV(product.images[0]) : '',
              isFirstVariant && product.images?.[0] ? '1' : '',
              isFirstVariant && product.images?.[0] ? escapeCSV(product.name) : '',
              '',
              'FALSE',
              isFirstVariant ? escapeCSV(product.name) : '',
              isFirstVariant ? escapeCSV(product.description?.substring(0, 320)) : '',
              isFirstVariant ? escapeCSV(productCategory) : '',
              isFirstVariant ? 'Unisex' : '',
              isFirstVariant ? 'Adult' : '',
              isFirstVariant ? escapeCSV(product.sku || '') : '',
              isFirstVariant ? escapeCSV(product.category) : '',
              isFirstVariant ? escapeCSV(tags) : '',
              isFirstVariant ? 'new' : '',
              isFirstVariant ? 'FALSE' : '',
              '', '', '', '', '',
            ];
            rows.push(row);
            isFirstVariant = false;
          });
        });

        // Additional images
        if (product.images && product.images.length > 1) {
          product.images.slice(1).forEach((imageUrl, index) => {
            const imageRow = Array(headers.length).fill('');
            imageRow[1] = escapeCSV(product.slug);
            imageRow[33] = escapeCSV(imageUrl);
            imageRow[34] = String(index + 2);
            imageRow[35] = escapeCSV(product.name);
            rows.push(imageRow);
          });
        }
      }
    });

    // Convert rows to CSV string with UTF-8 BOM for Excel compatibility
    // The BOM (Byte Order Mark) helps Excel recognize UTF-8 encoding
    const csvContent = '\uFEFF' + rows.map((row) => row.join(',')).join('\n');

    // Return CSV file as download with UTF-8 encoding
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="shopify-products-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

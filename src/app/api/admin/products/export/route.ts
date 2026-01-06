import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { checkIsAdmin } from '@/lib/admin-auth';

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkIsAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    // Shopify CSV headers - matching Shopify's export format exactly
    const headers = [
      'Handle',
      'Title',
      'Body (HTML)',
      'Vendor',
      'Product Category',
      'Type',
      'Tags',
      'Published',
      'Option1 Name',
      'Option1 Value',
      'Option1 Linked To',
      'Option2 Name',
      'Option2 Value',
      'Option2 Linked To',
      'Option3 Name',
      'Option3 Value',
      'Option3 Linked To',
      'Variant SKU',
      'Variant Grams',
      'Variant Inventory Tracker',
      'Variant Inventory Qty',
      'Variant Inventory Policy',
      'Variant Fulfillment Service',
      'Variant Price',
      'Variant Compare At Price',
      'Variant Requires Shipping',
      'Variant Taxable',
      'Unit Price Total Measure',
      'Unit Price Total Measure Unit',
      'Unit Price Base Measure',
      'Unit Price Base Measure Unit',
      'Variant Barcode',
      'Image Src',
      'Image Position',
      'Image Alt Text',
      'Gift Card',
      'SEO Title',
      'SEO Description',
      'Variant Image',
      'Variant Weight Unit',
      'Variant Tax Code',
      'Cost per item',
      'Status',
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
        // Single product without variants
        const row = [
          escapeCSV(product.slug), // Handle
          escapeCSV(product.name), // Title
          escapeCSV(product.description), // Body (HTML)
          escapeCSV(vendor), // Vendor
          escapeCSV(productCategory), // Product Category
          escapeCSV(product.category), // Type
          escapeCSV(tags), // Tags
          'true', // Published
          'Title', // Option1 Name
          'Default Title', // Option1 Value
          '', // Option1 Linked To
          '', // Option2 Name
          '', // Option2 Value
          '', // Option2 Linked To
          '', // Option3 Name
          '', // Option3 Value
          '', // Option3 Linked To
          escapeCSV(product.sku || product.product_id), // Variant SKU
          escapeCSV(product.weight || '0.0'), // Variant Grams
          'shopify', // Variant Inventory Tracker
          product.in_stock ? '100' : '0', // Variant Inventory Qty
          'deny', // Variant Inventory Policy
          'manual', // Variant Fulfillment Service
          escapeCSV(basePrice), // Variant Price
          '', // Variant Compare At Price
          'true', // Variant Requires Shipping
          'true', // Variant Taxable
          '', // Unit Price Total Measure
          '', // Unit Price Total Measure Unit
          '', // Unit Price Base Measure
          '', // Unit Price Base Measure Unit
          '', // Variant Barcode
          escapeCSV(product.images?.[0] || ''), // Image Src
          '1', // Image Position
          escapeCSV(product.name), // Image Alt Text
          'false', // Gift Card
          escapeCSV(product.name), // SEO Title
          escapeCSV(product.description?.substring(0, 320)), // SEO Description
          '', // Variant Image
          'kg', // Variant Weight Unit
          '', // Variant Tax Code
          '', // Cost per item
          escapeCSV(shopifyStatus), // Status
        ];
        rows.push(row);

        // Additional images
        if (product.images && product.images.length > 1) {
          product.images.slice(1).forEach((imageUrl, index) => {
            const imageRow = Array(headers.length).fill('');
            imageRow[0] = escapeCSV(product.slug); // Handle
            imageRow[32] = escapeCSV(imageUrl); // Image Src
            imageRow[33] = String(index + 2); // Image Position
            imageRow[34] = escapeCSV(product.name); // Image Alt Text
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
              escapeCSV(product.slug), // Handle
              isFirstVariant ? escapeCSV(product.name) : '', // Title
              isFirstVariant ? escapeCSV(product.description) : '', // Body (HTML)
              isFirstVariant ? escapeCSV(vendor) : '', // Vendor
              isFirstVariant ? escapeCSV(productCategory) : '', // Product Category
              isFirstVariant ? escapeCSV(product.category) : '', // Type
              isFirstVariant ? escapeCSV(tags) : '', // Tags
              isFirstVariant ? 'true' : '', // Published
              hasSizes ? 'Size' : '', // Option1 Name
              hasSizes ? escapeCSV(size.label) : '', // Option1 Value
              '', // Option1 Linked To
              hasGemstones ? 'Gemstone' : '', // Option2 Name
              hasGemstones ? escapeCSV(gemstone.name) : '', // Option2 Value
              '', // Option2 Linked To
              '', // Option3 Name
              '', // Option3 Value
              '', // Option3 Linked To
              escapeCSV(variantSKU), // Variant SKU
              escapeCSV(product.weight || '0.0'), // Variant Grams
              'shopify', // Variant Inventory Tracker
              product.in_stock && (gemstone.available !== false) ? '100' : '0', // Variant Inventory Qty
              'deny', // Variant Inventory Policy
              'manual', // Variant Fulfillment Service
              escapeCSV(variantPriceFormatted), // Variant Price
              '', // Variant Compare At Price
              'true', // Variant Requires Shipping
              'true', // Variant Taxable
              '', // Unit Price Total Measure
              '', // Unit Price Total Measure Unit
              '', // Unit Price Base Measure
              '', // Unit Price Base Measure Unit
              '', // Variant Barcode
              isFirstVariant && product.images?.[0] ? escapeCSV(product.images[0]) : '', // Image Src
              isFirstVariant && product.images?.[0] ? '1' : '', // Image Position
              isFirstVariant && product.images?.[0] ? escapeCSV(product.name) : '', // Image Alt Text
              'false', // Gift Card
              isFirstVariant ? escapeCSV(product.name) : '', // SEO Title
              isFirstVariant ? escapeCSV(product.description?.substring(0, 320)) : '', // SEO Description
              '', // Variant Image
              'kg', // Variant Weight Unit
              '', // Variant Tax Code
              '', // Cost per item
              isFirstVariant ? escapeCSV(shopifyStatus) : '', // Status
            ];
            rows.push(row);
            isFirstVariant = false;
          });
        });

        // Additional images
        if (product.images && product.images.length > 1) {
          product.images.slice(1).forEach((imageUrl, index) => {
            const imageRow = Array(headers.length).fill('');
            imageRow[0] = escapeCSV(product.slug); // Handle
            imageRow[32] = escapeCSV(imageUrl); // Image Src
            imageRow[33] = String(index + 2); // Image Position
            imageRow[34] = escapeCSV(product.name); // Image Alt Text
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

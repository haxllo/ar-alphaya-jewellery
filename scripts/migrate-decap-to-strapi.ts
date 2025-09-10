#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import axios from 'axios';
import FormData from 'form-data';

// Types matching Decap CMS schema
type Size = { label: string; value: string };
type Gemstone = { 
  name: string; 
  value: string; 
  priceAdjustment?: number; 
  description?: string; 
  available?: boolean 
};

type ProductFrontMatter = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  images?: string[];
  category: 'rings' | 'earrings' | 'pendants' | 'bracelets-bangles';
  sku?: string;
  materials?: string[];
  weight?: number;
  dimensions?: string;
  sizes?: Size[];
  gemstones?: Gemstone[];
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

// Configuration
const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, 'src', 'data', 'products');
const SITE_JSON = path.join(ROOT, 'src', 'data', 'site.json');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

// Strapi configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('❌ Missing STRAPI_TOKEN environment variable.');
  console.error('   Create an API token in Strapi admin: Settings > API Tokens');
  process.exit(1);
}

// CLI flags
const isDryRun = process.argv.includes('--dry-run');
const batchSize = parseInt(process.argv.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '5');

console.log(`🚀 Starting Decap CMS to Strapi migration`);
console.log(`   Source: ${ROOT}`);
console.log(`   Target: ${STRAPI_URL}`);
console.log(`   Dry run: ${isDryRun}`);
console.log(`   Batch size: ${batchSize}`);
console.log('');

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  timeout: 30000
});

/**
 * Upload an image file to Strapi media library
 */
async function uploadImage(absPath: string): Promise<number | null> {
  if (!fs.existsSync(absPath)) {
    console.warn(`⚠️  Image not found: ${absPath}`);
    return null;
  }

  try {
    const form = new FormData();
    const fileStream = fs.createReadStream(absPath);
    const fileName = path.basename(absPath);
    
    form.append('files', fileStream, fileName);
    
    console.log(`   📷 Uploading image: ${fileName}`);
    
    if (isDryRun) {
      console.log(`   [DRY RUN] Would upload ${fileName}`);
      return 999; // Mock ID for dry run
    }

    const response = await axios.post(`${STRAPI_URL}/api/upload`, form, {
      headers: { 
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        ...form.getHeaders() 
      },
      timeout: 60000
    });

    const uploadedFile = response.data?.[0];
    if (uploadedFile?.id) {
      console.log(`   ✅ Uploaded: ${fileName} (ID: ${uploadedFile.id})`);
      return uploadedFile.id;
    }

    throw new Error('No file ID in response');
  } catch (error: any) {
    console.error(`   ❌ Failed to upload ${path.basename(absPath)}: ${error.message}`);
    return null;
  }
}

/**
 * Create or update a product in Strapi
 */
async function upsertProduct(frontmatter: ProductFrontMatter, body: string): Promise<void> {
  console.log(`📦 Processing product: ${frontmatter.slug}`);

  try {
    // Check if product exists by slug
    const existingResponse = await api.get('/products', { 
      params: { 
        'filters[slug][$eq]': frontmatter.slug,
        'pagination[limit]': 1
      } 
    });
    const existingProduct = existingResponse.data?.data?.[0];

    // Upload images
    const imageIds: number[] = [];
    for (const relativeImagePath of frontmatter.images || []) {
      const absolutePath = relativeImagePath.startsWith('/images/')
        ? path.join(ROOT, 'public', relativeImagePath)
        : path.join(IMAGES_DIR, relativeImagePath);
        
      const imageId = await uploadImage(absolutePath);
      if (imageId) {
        imageIds.push(imageId);
      }
    }

    // Build Strapi payload
    const payload = {
      data: {
        productId: frontmatter.id,
        name: frontmatter.name,
        slug: frontmatter.slug,
        price: frontmatter.price,
        currency: frontmatter.currency || 'LKR',
        images: imageIds,
        category: frontmatter.category,
        sku: frontmatter.sku || '',
        materials: frontmatter.materials || [],
        weight: frontmatter.weight || null,
        dimensions: frontmatter.dimensions || '',
        sizes: frontmatter.sizes || [],
        gemstones: frontmatter.gemstones || [],
        inStock: frontmatter.inStock !== false,
        featured: frontmatter.featured === true,
        tags: frontmatter.tags || [],
        body: body,
        originalCreatedAt: frontmatter.createdAt || null,
        originalUpdatedAt: frontmatter.updatedAt || null,
        publishedAt: new Date().toISOString() // Auto-publish
      }
    };

    if (isDryRun) {
      console.log(`   [DRY RUN] Would ${existingProduct ? 'update' : 'create'} product:`, {
        slug: payload.data.slug,
        images: payload.data.images.length,
        sizes: payload.data.sizes.length,
        gemstones: payload.data.gemstones.length
      });
      return;
    }

    if (existingProduct) {
      await api.put(`/products/${existingProduct.id}`, payload);
      console.log(`   ✅ Updated product: ${frontmatter.slug}`);
    } else {
      await api.post('/products', payload);
      console.log(`   ✅ Created product: ${frontmatter.slug}`);
    }

  } catch (error: any) {
    console.error(`   ❌ Failed to process ${frontmatter.slug}: ${error.response?.data?.message || error.message}`);
    if (error.response?.data) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

/**
 * Migrate all products from markdown files
 */
async function migrateProducts(): Promise<void> {
  console.log(`\n📁 Migrating products from: ${PRODUCTS_DIR}`);
  
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.warn(`⚠️  Products directory not found: ${PRODUCTS_DIR}`);
    return;
  }

  const markdownFiles = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.md'));
  
  if (markdownFiles.length === 0) {
    console.warn(`⚠️  No markdown files found in: ${PRODUCTS_DIR}`);
    return;
  }

  console.log(`   Found ${markdownFiles.length} product files`);

  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < markdownFiles.length; i += batchSize) {
    const batch = markdownFiles.slice(i, i + batchSize);
    console.log(`\n   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(markdownFiles.length / batchSize)}...`);
    
    await Promise.all(batch.map(async (file) => {
      try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(rawContent);
        const frontmatter = parsed.data as ProductFrontMatter;
        const body = parsed.content.trim();

        await upsertProduct(frontmatter, body);
      } catch (error: any) {
        console.error(`   ❌ Error processing ${file}: ${error.message}`);
      }
    }));

    // Brief pause between batches
    if (i + batchSize < markdownFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Migrate site settings from site.json
 */
async function migrateSiteSettings(): Promise<void> {
  console.log(`\n⚙️  Migrating site settings from: ${SITE_JSON}`);
  
  if (!fs.existsSync(SITE_JSON)) {
    console.warn(`⚠️  Site settings file not found: ${SITE_JSON}`);
    return;
  }

  try {
    const siteData = JSON.parse(fs.readFileSync(SITE_JSON, 'utf-8'));

    const payload = {
      data: {
        title: siteData.title,
        description: siteData.description,
        email: siteData.email,
        phone: siteData.phone,
        whatsapp: siteData.whatsapp,
        address: siteData.address,
        instagram: siteData.instagram,
        collections: siteData.collections || []
      }
    };

    if (isDryRun) {
      console.log(`   [DRY RUN] Would create/update site settings:`, {
        title: payload.data.title,
        collections: payload.data.collections.length
      });
      return;
    }

    // Check if site settings exist
    const existingResponse = await api.get('/site-setting');
    const exists = existingResponse.data?.data?.id;

    if (exists) {
      await api.put('/site-setting', payload);
      console.log(`   ✅ Updated site settings`);
    } else {
      await api.post('/site-setting', payload);
      console.log(`   ✅ Created site settings`);
    }

  } catch (error: any) {
    console.error(`   ❌ Failed to migrate site settings: ${error.response?.data?.message || error.message}`);
    if (error.response?.data) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

/**
 * Test Strapi connection and authentication
 */
async function testConnection(): Promise<boolean> {
  try {
    console.log(`🔗 Testing connection to: ${STRAPI_URL}`);
    
    const response = await api.get('/products?pagination[limit]=1');
    console.log(`   ✅ Connected successfully`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Connection failed: ${error.message}`);
    if (error.response?.status === 401) {
      console.error('   Check your STRAPI_TOKEN - it may be invalid or expired');
    }
    return false;
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  
  try {
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      process.exit(1);
    }

    // Run migrations
    await migrateProducts();
    await migrateSiteSettings();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\n🎉 Migration completed in ${duration}s`);
    
    if (isDryRun) {
      console.log(`\n💡 This was a dry run. Remove --dry-run flag to execute the migration.`);
    } else {
      console.log(`\n💡 Next steps:`);
      console.log(`   1. Visit ${STRAPI_URL}/admin to verify the data`);
      console.log(`   2. Configure API permissions: Settings > Users & Permissions > Roles > Public`);
      console.log(`   3. Test GraphQL playground: ${STRAPI_URL}/graphql`);
    }

  } catch (error: any) {
    console.error(`\n💥 Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

export { main as migrateDecapToStrapi };

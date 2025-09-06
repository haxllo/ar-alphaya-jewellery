# Manual Product Creation Guide

Since the CMS image upload is having issues, here's a simple way to add products manually:

## Method 1: Upload Images First (Recommended)

### Step 1: Upload Images
1. Go to your **GitHub repository**: https://github.com/haxllo/ar-alphaya-jewellery
2. Navigate to `public/images/products/`
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your product images
5. Name them clearly (e.g., `ruby-pendant-main.jpg`, `ruby-pendant-side.jpg`)
6. Click **"Commit changes"**

### Step 2: Create Product File
1. In GitHub, go to `src/data/products/`
2. Click **"Add file"** → **"Create new file"**
3. Name it: `your-product-name.md`
4. Use the template below

## Method 2: Use Template

### Product Template
Copy this template and replace the values:

```markdown
---
id: "your-product-001"
slug: "your-product-name"
name: "Your Product Name"
price: 150000
currency: "LKR"
images:
  - "/images/products/your-image-1.jpg"
  - "/images/products/your-image-2.jpg"
  - "/images/products/your-image-3.jpg"
category: "rings"
materials:
  - "18k Gold"
  - "Natural Ruby"
weight: 4.5
dimensions: "15mm x 12mm"
sizes:
  - label: "6"
    value: "6"
  - label: "7"
    value: "7"
  - label: "8"
    value: "8"
gemstones:
  - name: "Natural Ruby"
    value: "natural-ruby"
    priceAdjustment: 0
    description: "Premium natural ruby"
    available: true
  - name: "Lab Ruby"
    value: "lab-ruby"
    priceAdjustment: -30000
    description: "High-quality lab ruby"
    available: true
inStock: true
featured: true
tags:
  - "ruby"
  - "elegant"
createdAt: "2025-09-06T00:00:00.000Z"
updatedAt: "2025-09-06T00:00:00.000Z"
---

Your detailed product description goes here.

Talk about the materials, craftsmanship, occasions it's perfect for, etc.

Multiple paragraphs are supported.
```

## Quick Reference

### Categories
- `"rings"`
- `"earrings"`  
- `"pendants"`
- `"bracelets-bangles"`

### Price Format
Always use full rupee amounts as integers:
- Rs 180,000 = `180000`
- Rs 25,500 = `25500`

### Image Paths
Always start with `/images/products/`:
- `"/images/products/ruby-ring-main.jpg"`
- `"/images/products/diamond-earrings-pair.jpg"`

## After Creating Product

1. **Commit the file** in GitHub
2. **Wait 2-3 minutes** for Netlify to deploy
3. **Check your website** - the product should appear automatically

## Need Help?

If you need help with:
- Image sizing/compression
- Creating the markdown file
- Troubleshooting

Just let me know and I can help you create the files manually!

## Benefits of This Method

✅ **Reliable** - No CMS upload issues  
✅ **Full Control** - Edit everything exactly as needed  
✅ **Fast** - Direct to production  
✅ **Professional** - All advanced features still work  
✅ **No Limits** - Upload any size/number of images

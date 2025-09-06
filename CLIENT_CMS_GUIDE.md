# Client CMS Guide: Managing Your Jewelry Products

This guide will help you add, edit, and manage products on your AR Alphaya Jewellery website using the Content Management System (CMS).

## 🚀 Getting Started

### Accessing Your CMS
1. **Go to your CMS admin panel:** `https://aralphaya.netlify.app/admin`
2. **Sign in** with your Netlify Identity credentials
3. You'll see the main dashboard with "Products" and "Site Settings" sections

### Initial Setup (One-time only)
Your developer will provide you with:
- CMS admin login credentials
- Initial training on the interface
- Contact information for technical support

## 📦 Managing Products

### Adding a New Product

1. **Click "Products"** from the main dashboard
2. **Click "New Product"** button
3. **Fill in the required information:**

#### Basic Information
- **Product ID**: Create a unique identifier (e.g., `RNG-001`, `EAR-002`)
- **Product Name**: The display name customers will see
- **URL Slug**: Auto-generated from the name (e.g., `diamond-ring`)
- **Price (LKR)**: Enter the price in Sri Lankan Rupees (whole numbers only)

#### Product Images
- **Click "Choose images"** to upload product photos
- **Upload high-quality images** (recommended: 1200x1200 pixels minimum)
- **First image becomes the main product image**
- **Add multiple angles** for better customer experience

#### Product Details
- **Category**: Select from Rings, Earrings, Pendants, or Bracelets & Bangles
- **SKU**: Stock Keeping Unit (optional, for inventory tracking)
- **Materials**: List all materials used (e.g., "14k Gold", "Diamond", "Silver")

#### Sizes & Availability
- **Available Sizes**: Add size options if applicable
  - **Size Label**: What customers see (e.g., "US 7", "Medium")
  - **Size Value**: Internal value (e.g., "7", "M")
- **In Stock**: Toggle on/off based on availability
- **Featured Product**: Toggle on to show on homepage

#### Additional Information
- **Tags**: Keywords for search (e.g., "wedding", "vintage", "modern")
- **Product Description**: Detailed description with features, care instructions, etc.

4. **Click "Publish"** to make the product live
5. **Product appears immediately on your website**

### Editing an Existing Product

1. **Go to "Products"** section
2. **Click on the product** you want to edit
3. **Make your changes**
4. **Click "Publish"** to save changes
5. **Changes appear instantly on the website**

### Removing a Product

1. **Open the product** you want to remove
2. **Click "Delete"** button (usually at the top)
3. **Confirm deletion**
4. **Product is removed from website immediately**

### Making a Product "Out of Stock"

Instead of deleting, you can temporarily hide products:
1. **Edit the product**
2. **Toggle "In Stock" to OFF**
3. **Publish changes**
4. **Product shows as "Out of Stock" on website**

## 🎯 Best Practices

### Product Photography
- **Use good lighting** (natural daylight is best)
- **Take multiple angles** (front, back, side, close-ups)
- **Show scale** (product being worn or next to common objects)
- **Maintain consistency** in background and style
- **File format**: JPG or PNG
- **File size**: Keep under 2MB for faster loading

### Writing Product Descriptions
- **Be descriptive** but concise
- **Include key features** (materials, dimensions, special characteristics)
- **Add care instructions**
- **Use bullet points** for easy reading
- **Mention occasions** (wedding, everyday, special events)

### Pricing Strategy
- **Use whole numbers** (no decimals in the CMS)
- **Price is in LKR** by default
- **Consider showing value** (compare with retail prices)
- **Update regularly** based on material costs

### SEO-Friendly Practices
- **Use descriptive product names** (not just model numbers)
- **Add relevant tags** for search functionality
- **Write meaningful descriptions** with keywords customers might search for
- **Use consistent naming** conventions

## 📊 Site Settings Management

### Updating Collections
1. **Click "Site Settings"**
2. **Click "Site Configuration"**
3. **Modify "Product Collections"** section
4. **Add/edit categories** as needed
5. **Save changes**

### Collection Information
- **Collection Handle**: URL slug (e.g., "rings", "earrings")
- **Collection Title**: Display name customers see
- **Description**: Brief description of the collection
- **Collection Image**: Optional banner image for the collection

## 🔧 Troubleshooting

### Common Issues

**Problem: Images won't upload**
- **Check file size** (must be under 10MB)
- **Check file format** (JPG, PNG, GIF only)
- **Try refreshing the page** and uploading again

**Problem: Changes don't appear on website**
- **Wait 2-3 minutes** for changes to deploy
- **Clear your browser cache** (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)
- **Check that you clicked "Publish"** not just "Save"

**Problem: Can't access CMS**
- **Check your login credentials**
- **Try resetting your password**
- **Contact your developer** if issues persist

**Problem: Product not showing in correct category**
- **Check category spelling** matches exactly
- **Verify category exists** in Site Settings
- **Re-publish the product**

### Getting Help
- **Technical Issues**: Contact your developer
- **CMS Training**: Request additional training session
- **Content Questions**: Refer to this guide or ask your developer

## 📋 Daily/Weekly Tasks

### Daily Tasks
- [ ] Check for new orders (when order system is implemented)
- [ ] Update stock status for sold items
- [ ] Respond to customer inquiries

### Weekly Tasks
- [ ] Review and update product descriptions
- [ ] Add new products if available
- [ ] Check that all images are displaying correctly
- [ ] Review pricing for any needed adjustments

### Monthly Tasks
- [ ] Review product performance (popular vs. unpopular items)
- [ ] Update featured products
- [ ] Add seasonal or new collection items
- [ ] Archive or remove discontinued products

## 🎨 Advanced Features

### Rich Text Descriptions
The product description field supports formatting:
- **Bold text**: `**bold text**`
- **Italic text**: `*italic text*`
- **Bullet points**: Use `-` at the start of lines
- **Numbered lists**: Use `1.` at the start of lines
- **Links**: `[link text](URL)`

### Image Organization
- **Name images descriptively** before uploading
- **Keep original high-resolution files** as backups
- **Organize by product type** on your computer
- **Maintain consistent naming** (e.g., product-name-angle.jpg)

## 📞 Support Information

### Contact Details
- **Technical Support**: [Your developer's contact information]
- **CMS Issues**: Report bugs or issues immediately
- **Training**: Additional training sessions available

### Important Links
- **CMS Admin**: https://aralphaya.netlify.app/admin
- **Live Website**: https://aralphaya.netlify.app
- **This Guide**: Keep bookmarked for reference

---

**Remember**: All changes are immediate and live on your website. Always double-check information before publishing!

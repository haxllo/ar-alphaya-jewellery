# Product Images Folder

Upload your product images here using GitHub or any file manager.

## Naming Convention

Use descriptive, lowercase filenames with hyphens:

### Good Examples:
- `ruby-heart-pendant-main.jpg`
- `diamond-solitaire-ring-side-view.jpg`
- `gold-hoop-earrings-pair.jpg`
- `emerald-tennis-bracelet-detail.jpg`

### Avoid:
- Spaces: `Ruby Heart Pendant.jpg` ❌
- Special characters: `Ring@2024.jpg` ❌
- Generic names: `IMG_1234.jpg` ❌

## Image Guidelines

- **Format:** JPG or PNG (JPG recommended for photos)
- **Size:** Under 2MB each for fast loading
- **Dimensions:** At least 800px width for main images
- **Quality:** High resolution for zoom functionality

## How to Upload

### Method 1: GitHub (Recommended)
1. Go to: https://github.com/haxllo/ar-alphaya-jewellery
2. Navigate to `public/images/products/`
3. Click "Add file" → "Upload files"
4. Drag and drop your images
5. Add a commit message like "Add ruby pendant images"
6. Click "Commit changes"

### Method 2: Clone Repository
```bash
git clone https://github.com/haxllo/ar-alphaya-jewellery.git
cd ar-alphaya-jewellery
# Copy your images to public/images/products/
git add public/images/products/
git commit -m "Add new product images"
git push origin main
```

## Using Images in Products

Reference them in your product markdown files like this:

```yaml
images:
  - "/images/products/ruby-pendant-main.jpg"
  - "/images/products/ruby-pendant-side.jpg"
  - "/images/products/ruby-pendant-back.jpg"
```

## Image Processing

Netlify automatically optimizes your images for:
- ✅ Fast loading
- ✅ Multiple device sizes  
- ✅ Modern formats (WebP)
- ✅ Compression without quality loss

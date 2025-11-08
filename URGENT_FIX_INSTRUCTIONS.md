# URGENT: Image Upload Fix Instructions

## The Problem

Your OLD test product in the database has OLD image URLs with transformations:
```
https://2vhk07la2x.ucarecd.net/8b6f7ef0-0be6-4ce5-accb-b2d38a9971a8/-/preview/-/format/auto/-/quality/smart/
```

The new code saves CLEAN URLs like:
```
https://ucarecdn.com/8b6f7ef0-0be6-4ce5-accb-b2d38a9971a8/
```

## Fix Steps

### 1. Delete OLD Test Products
1. Go to `/admin/products`
2. Select ALL test products with "admin" or test data
3. Click "Delete" in bulk actions
4. Confirm deletion

### 2. Create NEW Product (Clean Test)
1. Go to `/admin/products/new`
2. Open browser console (F12)
3. Fill in basic info:
   - Name: "Test Ring"
   - Price: 1000
   - Category: Rings

### 3. Upload Image (Watch Console)
1. Click the Uploadcare widget
2. Select ONE image
3. **WATCH CONSOLE - You should see:**
   ```
   === FILE UPLOAD SUCCESS EVENT ===
   Success event detail: { uuid: "abc123...", cdnUrl: "..." }
   Adding URL from success event: https://ucarecdn.com/abc123.../
   ```

4. **If you see this, it worked!**
5. **If you DON'T see this, the event isn't firing**

### 4. Check Image Preview
- After upload, you should see exactly ONE image in the preview grid
- If you see multiple images, screenshot the console and send to me

### 5. Publish Product
1. Click "Publish" button
2. Wait for success toast
3. Go to homepage or `/products/test-ring`
4. Image should display

## What to Send Me

If it still doesn't work, send me:

1. **Full console output** when uploading (copy all text that starts with ===)
2. **Screenshot** of the image preview area after upload
3. **The product URL** you're testing (e.g., `/products/test-ring`)
4. **Any error messages** in console (red text)

## Why This Happens

- Old URLs in database: Have transformations + subdomain
- New URLs: Clean, simple, work with Next.js
- You MUST test with a NEW product, not edit old ones

## Expected Behavior

**Upload 1 image:**
- Console shows 1 "FILE UPLOAD SUCCESS EVENT"
- 1 image appears in preview
- URL is: `https://ucarecdn.com/{uuid}/` (no transformations)
- Image displays on product page

**If duplicates still appear:**
- The `file-upload-success` event is firing multiple times
- OR the `onChange` event is still adding images (shouldn't happen)
- Send me the full console log

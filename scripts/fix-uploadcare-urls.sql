-- Fix Uploadcare URLs in database
-- Convert old ucarecdn.com URLs to project-specific subdomain with format/auto
-- This fixes HEIC images not displaying on website

-- Backup first (run this separately):
-- CREATE TABLE products_backup AS SELECT * FROM products;

-- Update all images to use correct CDN subdomain and format/auto
UPDATE products
SET images = (
  SELECT jsonb_agg(
    CASE 
      -- If URL uses old ucarecdn.com domain, convert to project subdomain with format/auto
      WHEN image_url::text LIKE '%ucarecdn.com/%' THEN 
        regexp_replace(
          image_url::text, 
          'https://ucarecdn\.com/([a-f0-9-]+)/?.*',
          'https://2vhk07la2x.ucarecd.net/\1/-/format/auto/',
          'g'
        )::jsonb
      -- If URL uses old subdomain without format/auto, add it
      WHEN image_url::text LIKE '%ucarecd.net/%' AND image_url::text NOT LIKE '%/-/%' THEN
        regexp_replace(
          image_url::text,
          'https://([^/]+\.ucarecd\.net)/([a-f0-9-]+)/?.*',
          'https://2vhk07la2x.ucarecd.net/\2/-/format/auto/',
          'g'
        )::jsonb
      -- Already correct, keep as-is
      ELSE image_url
    END
  )
  FROM jsonb_array_elements(images) AS image_url
)
WHERE images IS NOT NULL 
  AND jsonb_array_length(images) > 0;

-- Verify the changes (run after UPDATE)
SELECT 
  id,
  name,
  sku,
  images
FROM products
WHERE images IS NOT NULL
  AND jsonb_array_length(images) > 0
ORDER BY updated_at DESC
LIMIT 10;

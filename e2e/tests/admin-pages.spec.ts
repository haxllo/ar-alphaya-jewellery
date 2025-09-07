import { test, expect } from '@playwright/test'

test.describe('Admin Pages', () => {
  
  test('admin instructions page loads correctly', async ({ page }) => {
    await page.goto('/admin-instructions')
    
    // Check page title and main heading
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    await expect(page.locator('h1')).toContainText('AR Alphaya Jewellery - Product Management')
    
    // Check main section heading
    await expect(page.locator('h2').first()).toContainText('How to Add Products')
    
    // Check product upload system section exists
    await expect(page.locator('text=Product Upload System')).toBeVisible()
    
    // Check link to upload form exists and is functional
    const uploadLink = page.locator('a[href="/admin-upload"]')
    await expect(uploadLink).toBeVisible()
    await expect(uploadLink).toContainText('Start Adding Products')
    
    // Check product information sections
    await expect(page.locator('text=Product Information Required')).toBeVisible()
    await expect(page.locator('text=Basic Information')).toBeVisible()
    await expect(page.locator('text=Images & Details')).toBeVisible()
    
    // Check image guidelines section
    await expect(page.locator('text=Image Guidelines')).toBeVisible()
    await expect(page.locator('text=Photo Requirements')).toBeVisible()
    
    // Check enhanced features section
    await expect(page.locator('text=Enhanced Features Available')).toBeVisible()
    await expect(page.locator('text=Gemstone Options').first()).toBeVisible()
    await expect(page.locator('text=Size Selection')).toBeVisible()
    await expect(page.locator('text=WhatsApp Integration')).toBeVisible()
    
    // Check contact information
    await expect(page.locator('text=Need Help?')).toBeVisible()
    await expect(page.locator('text=+94 77 429 3406').first()).toBeVisible()
  })
  
  test('admin upload form loads correctly', async ({ page }) => {
    await page.goto('/admin-upload')
    
    // Check page title and main heading
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    await expect(page.locator('h1')).toContainText('Add New Product')
    
    // Check back to instructions link
    await expect(page.locator('a[href="/admin-instructions"]')).toBeVisible()
    await expect(page.locator('a[href="/admin-instructions"]')).toContainText('Back to Instructions')
    
    // Check form fields exist
    await expect(page.locator('input[name="id"]')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="slug"]')).toBeVisible()
    await expect(page.locator('input[name="price"]')).toBeVisible()
    await expect(page.locator('select[name="category"]')).toBeVisible()
    await expect(page.locator('input[name="weight"]')).toBeVisible()
    await expect(page.locator('input[name="dimensions"]')).toBeVisible()
    
    // Check category options exist
    const categorySelect = page.locator('select[name="category"]')
    await expect(categorySelect.locator('option[value="rings"]')).toHaveCount(1)
    await expect(categorySelect.locator('option[value="earrings"]')).toHaveCount(1)
    await expect(categorySelect.locator('option[value="pendants"]')).toHaveCount(1)
    await expect(categorySelect.locator('option[value="bracelets-bangles"]')).toHaveCount(1)
    
    // Check image upload area (file input is hidden but upload area is visible)
    await expect(page.locator('input[type="file"]')).toHaveCount(1)
    await expect(page.locator('text=Click to upload')).toBeVisible()
    
    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Create Product')
    
    // Check instructions section
    await expect(page.locator('text=Instructions:')).toBeVisible()
    await expect(page.locator('text=Fill in all the product details')).toBeVisible()
  })
  
  test('admin redirect page works correctly', async ({ page }) => {
    await page.goto('/admin')
    
    // Check page loads with redirect interface
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    await expect(page.locator('h1')).toContainText('AR Alphaya Jewellery')
    await expect(page.locator('h2')).toContainText('Product Management')
    
    // Check redirect message
    await expect(page.locator('text=Redirecting you to the product upload system')).toBeVisible()
    
    // Check upload form button
    await expect(page.locator('a[href="/admin-upload"]')).toBeVisible()
    await expect(page.locator('a[href="/admin-upload"]')).toContainText('Go to Upload Form')
    
    // Check instructions link
    await expect(page.locator('a[href="/admin-instructions"]')).toBeVisible()
    await expect(page.locator('a[href="/admin-instructions"]')).toContainText('View Instructions')
    
    // Check contact information
    await expect(page.locator('text=aralphayajewellery@gmail.com').first()).toBeVisible()
  })
  
  test('navigation between admin pages works', async ({ page }) => {
    // Start at instructions page
    await page.goto('/admin-instructions')
    await expect(page.locator('h1')).toContainText('AR Alphaya Jewellery - Product Management')
    
    // Click to upload form
    await page.click('a[href="/admin-upload"]')
    await page.waitForURL('**/admin-upload/**')
    await expect(page.locator('h1')).toContainText('Add New Product')
    
    // Navigate back to instructions
    await page.click('a[href="/admin-instructions"]')
    await page.waitForURL('**/admin-instructions/**')
    await expect(page.locator('h1')).toContainText('AR Alphaya Jewellery - Product Management')
  })
  
  test('form validation works on upload page', async ({ page }) => {
    await page.goto('/admin-upload')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check that required field validation triggers
    // (This tests HTML5 validation)
    const idField = page.locator('input[name="id"]')
    await expect(idField).toHaveAttribute('required')
    
    const nameField = page.locator('input[name="name"]')
    await expect(nameField).toHaveAttribute('required')
    
    const priceField = page.locator('input[name="price"]')
    await expect(priceField).toHaveAttribute('required')
    
    const descriptionField = page.locator('textarea[name="description"]')
    await expect(descriptionField).toHaveAttribute('required')
  })
})

test.describe('Admin Page Responsiveness', () => {
  
  test('admin instructions responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size
    await page.goto('/admin-instructions')
    
    // Check that page is readable on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('a[href="/admin-upload"]')).toBeVisible()
    
    // Check that grid layouts stack properly on mobile
    const infoSections = page.locator('.grid.grid-cols-1.md\\:grid-cols-2')
    await expect(infoSections).toBeVisible()
  })
  
  test('admin upload form responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size
    await page.goto('/admin-upload')
    
    // Check that form is usable on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[name="id"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check that form fields are properly sized
    const formInputs = page.locator('input, select, textarea')
    const firstInput = formInputs.first()
    await expect(firstInput).toBeVisible()
  })
})

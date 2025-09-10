import { test, expect } from '@playwright/test'

test.describe('Admin Pages', () => {
  
  test('admin CMS page loads correctly', async ({ page }) => {
    await page.goto('/admin/index.html')
    
    // Check page loads and has correct title
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Check that the page is not a 404 error
    const is404 = await page.locator('text=404').count() > 0
    expect(is404).toBeFalsy()
    
    // Check for Netlify Identity login button (indicates CMS is working)
    const hasLoginButton = await page.locator('text=Login with Netlify Identity').count() > 0
    expect(hasLoginButton).toBeTruthy()
  })
  
  test('admin CMS loads without critical JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Filter out expected errors
        if (!text.includes('Failed to load resource') && 
            !text.includes('500 (Internal Server Error)') &&
            !text.includes('NetworkError') &&
            !text.includes('Auth0') &&
            !text.includes('timeout') &&
            !text.includes('ECONNREFUSED')) {
          errors.push(text)
        }
      }
    })
    
    await page.goto('/admin/index.html')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that there are no critical JavaScript errors
    expect(errors.length).toBe(0)
  })
  
  test('admin page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/index.html')
    
    // Check that we get a successful response (not 404, 500, etc.)
    expect(response?.status()).toBeLessThan(400)
    
    // Check that the page loads
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
  })
})

test.describe('Admin Page Responsiveness', () => {
  
  test('admin CMS responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size
    await page.goto('/admin/index.html')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that page loads on mobile
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    
    // Check that it's not a 404 error
    const is404 = await page.locator('text=404').count() > 0
    expect(is404).toBeFalsy()
  })
  
  test('admin CMS loads on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }) // iPad size
    await page.goto('/admin/index.html')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that page loads on tablet
    await expect(page).toHaveTitle(/AR Alphaya Jewellery/)
    
    // Check that it's not a 404 error
    const is404 = await page.locator('text=404').count() > 0
    expect(is404).toBeFalsy()
  })
})
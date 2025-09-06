import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays the main navigation elements', async ({ page, isMobile }) => {
    // Check header is visible
    await expect(page.locator('header')).toBeVisible()
    
    // Check logo is present (select first one in header)
    await expect(page.locator('header').getByAltText(/ar alphaya jewellery logo/i)).toBeVisible()
    
    if (isMobile) {
      // On mobile, navigation is in mobile menu
      // Check mobile menu button is visible
      const menuButton = page.locator('header').locator('button').filter({ has: page.locator('svg') }).last()
      await expect(menuButton).toBeVisible()
      
      // Click mobile menu to reveal navigation
      await menuButton.click()
      
      // Check mobile navigation links - use more specific selectors to avoid conflicts
      await expect(page.locator('.md\\:hidden nav').getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.locator('.md\\:hidden').getByText('Jewelry').first()).toBeVisible()
      await expect(page.locator('.md\\:hidden nav').getByRole('link', { name: 'About' })).toBeVisible()
      await expect(page.locator('.md\\:hidden nav').getByRole('link', { name: 'Contact' })).toBeVisible()
    } else {
      // Desktop navigation is always visible
      await expect(page.locator('header nav').getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.locator('header nav').getByText('Jewelry')).toBeVisible()
      await expect(page.locator('header nav').getByRole('link', { name: 'About' })).toBeVisible()
      await expect(page.locator('header nav').getByRole('link', { name: 'Contact' })).toBeVisible()
    }
  })

  test('shows jewelry dropdown menu on hover', async ({ page, isMobile }) => {
    // Skip on mobile as dropdowns work differently on touch devices
    test.skip(isMobile, 'Dropdown hover behavior not applicable on mobile')
    
    // Find the jewelry dropdown container specifically in the header navigation
    const jewelryDropdownContainer = page.locator('header nav .relative.group').first()
    
    // Hover over the Jewelry button to trigger the dropdown
    await jewelryDropdownContainer.locator('button:has-text("Jewelry")').hover()
    
    // Wait for dropdown to become visible with CSS transition
    const dropdown = jewelryDropdownContainer.locator('.absolute').first()
    await expect(dropdown).toBeVisible()
    
    // Check each dropdown item by text content
    await expect(dropdown.getByText('Rings', { exact: true })).toBeVisible()
    await expect(dropdown.getByText('Earrings', { exact: true })).toBeVisible()
    await expect(dropdown.getByText('Pendants', { exact: true })).toBeVisible()
    await expect(dropdown.getByText('Bracelets & Bangles', { exact: true })).toBeVisible()
  })

  test('displays cart and wishlist icons', async ({ page }) => {
    // Check that there are SVG icons in header - simpler approach
    // Look for SVG links in the header (cart, wishlist, and sign-in all have SVG icons)
    const headerLinks = page.locator('header').getByRole('link').filter({ has: page.locator('svg') })
    await expect(headerLinks.first()).toBeVisible() // At least one SVG link should be visible
    
    // Check for at least 2 SVG-containing links (should have cart + wishlist, maybe also sign-in)
    await expect(headerLinks).toHaveCount(3) // Should have cart + wishlist + sign-in
  })

  test('shows featured products section', async ({ page }) => {
    // Look for any product-related content or headings that indicate products are displayed
    const productContent = page.locator('h1, h2, h3').filter({ 
      hasText: /featured|latest|products|jewelry|collection/i 
    }).or(page.locator('[data-testid*="product"], .product')).first()
    
    await expect(productContent).toBeVisible({ timeout: 15000 })
  })

  test('is responsive on mobile devices', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check mobile menu button is visible (hamburger menu)
      const menuButton = page.locator('header').locator('button').filter({ has: page.locator('svg') }).last()
      await expect(menuButton).toBeVisible()
      
      // Click mobile menu
      await menuButton.click()
      
      // Check mobile navigation is visible after opening menu
      await expect(page.locator('.md\\:hidden nav').getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.locator('.md\\:hidden').getByText('Jewelry').first()).toBeVisible()
    } else {
      // Desktop navigation should be visible (specify header nav context)
      await expect(page.locator('header nav').getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(page.locator('header nav').getByText('Jewelry')).toBeVisible()
    }
  })

  test('footer is present and contains company information', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded()
    
    // Check footer is visible
    await expect(page.locator('footer')).toBeVisible()
    
    // Check company name or contact information is present
    await expect(page.locator('footer')).toContainText(/ar alphaya/i)
  })

  test('page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Allow for some common non-critical errors and server errors during testing
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('Analytics') &&
      !error.includes('GTM') &&
      !error.includes('Non-critical') &&
      !error.includes('Failed to load resource') &&
      !error.includes('500 (Internal Server Error)') &&
      !error.includes('NetworkError') &&
      !error.includes('access control checks') &&
      !error.includes('/api/auth/me')
    )
    
    expect(criticalErrors).toEqual([])
  })

  test('has proper SEO meta tags', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/ar alphaya jewellery/i)
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
    
    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
  })
})

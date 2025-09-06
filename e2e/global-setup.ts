import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🎭 Setting up Playwright E2E environment...')
  
  // Environment variables are now set via the test script
  console.log(`Environment: ${process.env.NODE_ENV}`)
  console.log(`Auth0 configured: ${!!process.env.AUTH0_SECRET}`)
  
  // Create a browser instance to warm up the testing environment
  const browser = await chromium.launch()
  
  // Pre-authenticate a test user if needed
  // This would be used for tests that require authentication
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Wait for the development server to be ready
    await page.goto(config.webServer?.url || 'http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    
    console.log('✅ Application is ready for E2E testing')
  } catch (error) {
    console.error('❌ Failed to connect to application:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
  
  console.log('🎭 Playwright E2E setup complete')
}

export default globalSetup

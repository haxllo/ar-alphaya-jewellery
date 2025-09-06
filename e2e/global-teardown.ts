import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Tearing down Playwright E2E environment...')
  
  // Clean up any test data or external resources
  // For example: clear test database, reset external service states, etc.
  
  console.log('✅ Playwright E2E teardown complete')
}

export default globalTeardown

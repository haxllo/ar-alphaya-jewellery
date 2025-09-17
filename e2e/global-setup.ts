import type { FullConfig } from '@playwright/test'

async function globalSetup(_config: FullConfig) {
  // No-op placeholder for CI/local
}

export default globalSetup



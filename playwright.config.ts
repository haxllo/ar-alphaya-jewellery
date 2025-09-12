import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['line'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Custom headers for all requests */
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      // Load test environment variables from .env.test
      NODE_ENV: 'test',
      AUTH0_SECRET: process.env.AUTH0_SECRET || 'test-secret-for-playwright-only',
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL || 'https://test.auth0.com',
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'test-client-id',
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || 'test-client-secret',
      AUTH0_COOKIE_SECURE: process.env.AUTH0_COOKIE_SECURE || 'false',
      NEXT_PUBLIC_PAYHERE_SANDBOX: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX || 'true',
      NEXT_PUBLIC_PAYHERE_MERCHANT_ID: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || 'test-merchant-id',
    },
  },

  /* Global setup for authentication and test data */
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  /* Test timeout */
  timeout: 30000,
  expect: {
    /* Timeout for assertions */
    timeout: 10000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Ignore specific files and folders */
  testIgnore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/test-results/**',
    '**/playwright-report/**',
  ],
})

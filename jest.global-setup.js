module.exports = async () => {
  // Global setup before all tests run
  console.log('🧪 Setting up test environment...')
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  process.env.NEXT_PUBLIC_SITE_NAME = 'AR Alphaya Jewellery (Test)'
  
  // Mock Auth0 environment variables for tests
  process.env.AUTH0_SECRET = 'test-secret-key-that-is-long-enough-for-testing'
  process.env.AUTH0_BASE_URL = 'http://localhost:3000'
  process.env.AUTH0_ISSUER_BASE_URL = 'https://test.auth0.com'
  process.env.AUTH0_CLIENT_ID = 'test-client-id'
  process.env.AUTH0_CLIENT_SECRET = 'test-client-secret'
  
  // Mock PayHere environment variables for tests
  process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID = 'test-merchant-id'
  process.env.PAYHERE_MERCHANT_SECRET = 'test-merchant-secret'
  process.env.NEXT_PUBLIC_PAYHERE_SANDBOX = 'true'
  
  console.log('✅ Test environment setup complete')
}

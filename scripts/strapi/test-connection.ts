#!/usr/bin/env ts-node

/**
 * Test Strapi connection and API endpoints
 */

const STRAPI_URL_TEST = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN_TEST = process.env.STRAPI_TOKEN

if (!STRAPI_URL_TEST || !STRAPI_TOKEN_TEST) {
  console.error('❌ Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_TOKEN in environment.')
  process.exit(1)
}

async function testEndpoint(path: string, name: string) {
  try {
    const res = await fetch(`${STRAPI_URL_TEST}/api${path}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN_TEST}`,
      },
    })
    
    if (res.ok) {
      const data = await res.json()
      console.log(`✅ ${name}: OK (${res.status})`)
      if (path === '/products') {
        console.log(`   Found ${data.data?.length || 0} products`)
      }
      return true
    } else {
      console.log(`❌ ${name}: ${res.status} ${res.statusText}`)
      if (res.status === 404) {
        console.log(`   Content type might not exist yet`)
      }
      return false
    }
  } catch (error: any) {
    console.log(`❌ ${name}: ${error.message}`)
    return false
  }
}

async function testConnection() {
  console.log('🔍 Testing Strapi connection...')
  console.log(`📍 URL: ${STRAPI_URL_TEST}`)
  console.log(`🔑 Token: ${STRAPI_TOKEN_TEST!.substring(0, 20)}...`)
  console.log('')
  
  // Test base API
  const baseOk = await testEndpoint('', 'Base API')
  
  // Test content types
  const productsOk = await testEndpoint('/products', 'Products endpoint')
  const siteOk = await testEndpoint('/site-setting', 'Site setting endpoint')
  
  console.log('')
  if (baseOk || productsOk || siteOk) {
    console.log('✅ Connection successful!')
    if (!productsOk || !siteOk) {
      console.log('ℹ️  Some endpoints are not ready - follow the setup guide to create content types.')
    }
  } else {
    console.log('❌ Connection failed!')
    console.log('💡 Check your STRAPI_URL and STRAPI_TOKEN in .env.local')
  }
}

testConnection().catch((e) => {
  console.error('❌ Test failed:', e.message)
  process.exit(1)
})

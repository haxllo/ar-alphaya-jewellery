#!/bin/bash

# Set test environment variables for Playwright
export NODE_ENV=test
export AUTH0_SECRET="playwright-test-secret-key-32-bytes-long"
export AUTH0_BASE_URL="http://localhost:3000"
export AUTH0_ISSUER_BASE_URL="https://test.auth0.com"
export AUTH0_CLIENT_ID="test-client-id"
export AUTH0_CLIENT_SECRET="test-client-secret"
export AUTH0_COOKIE_SECURE="false"
export NEXT_PUBLIC_SITE_URL="http://localhost:3000"
export NEXT_PUBLIC_PAYHERE_SANDBOX="true"
export NEXT_PUBLIC_PAYHERE_MERCHANT_ID="test-merchant-id"

# Run Playwright tests
npx playwright test "$@"

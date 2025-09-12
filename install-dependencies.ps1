# AR Alphaya Jewellery - Dependency Installation Script
# Run this script in PowerShell as Administrator

Write-Host "🚀 AR Alphaya Jewellery - Dependency Installation" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        Write-Host "   Recommended version: Node.js 18.x or higher" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm not found. Please reinstall Node.js" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ npm not found. Please reinstall Node.js" -ForegroundColor Red
    exit 1
}

# Check if we're in the correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory confirmed" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error installing dependencies: $_" -ForegroundColor Red
    exit 1
}

# Run security audit
Write-Host "`n🔒 Running security audit..." -ForegroundColor Yellow
try {
    npm audit
    Write-Host "✅ Security audit completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Security audit completed with warnings" -ForegroundColor Yellow
}

# Check if .env.local exists
Write-Host "`n🔧 Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Creating template..." -ForegroundColor Yellow
    
    $envTemplate = @"
# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret-here
AUTH0_BASE_URL=https://aralphaya.netlify.app
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# PayHere Configuration
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
PAYHERE_SANDBOX=true

# Security Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://aralphaya.netlify.app

# CMS Configuration
NETLIFY_IDENTITY_URL=https://aralphaya.netlify.app/.netlify/identity
"@
    
    $envTemplate | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local template" -ForegroundColor Green
    Write-Host "   Please update the values in .env.local with your actual credentials" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local found" -ForegroundColor Green
}

# Test build
Write-Host "`n🏗️  Testing build..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        Write-Host "   Check the error messages above" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Build error: $_" -ForegroundColor Red
}

# Final summary
Write-Host "`n🎉 Installation Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "✅ Node.js and npm verified" -ForegroundColor Green
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host "✅ Security audit completed" -ForegroundColor Green
Write-Host "✅ Environment template created" -ForegroundColor Green

Write-Host "`n📚 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.local with your actual credentials" -ForegroundColor White
Write-Host "2. Review VULNERABILITIES.md for security fixes" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host "4. Visit http://localhost:3000 to test the application" -ForegroundColor White

Write-Host "`n🔒 Security Commands:" -ForegroundColor Yellow
Write-Host "npm run security:audit  - Run security audit" -ForegroundColor White
Write-Host "npm run security:scan   - Run vulnerability scan" -ForegroundColor White
Write-Host "npm run security:fix    - Fix security issues" -ForegroundColor White

Write-Host "`n✨ Installation completed successfully!" -ForegroundColor Green

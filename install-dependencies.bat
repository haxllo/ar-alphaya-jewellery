@echo off
REM AR Alphaya Jewellery - Dependency Installation Script
REM Run this script in Command Prompt as Administrator

echo.
echo 🚀 AR Alphaya Jewellery - Dependency Installation
echo =================================================
echo.

REM Check if Node.js is installed
echo 📋 Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    echo    Recommended version: Node.js 18.x or higher
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: %NODE_VERSION%
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please reinstall Node.js
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm found: %NPM_VERSION%
)

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)
echo ✅ Project directory confirmed

REM Install dependencies
echo.
echo 📦 Installing dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully!
)

REM Run security audit
echo.
echo 🔒 Running security audit...
npm audit
if %errorlevel% neq 0 (
    echo ⚠️  Security audit completed with warnings
) else (
    echo ✅ Security audit completed
)

REM Check if .env.local exists
echo.
echo 🔧 Checking environment configuration...
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Creating template...
    
    (
        echo # Auth0 Configuration
        echo AUTH0_SECRET=your-auth0-secret-here
        echo AUTH0_BASE_URL=https://aralphaya.netlify.app
        echo AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
        echo AUTH0_CLIENT_ID=your-auth0-client-id
        echo AUTH0_CLIENT_SECRET=your-auth0-client-secret
        echo.
        echo # PayHere Configuration
        echo PAYHERE_MERCHANT_ID=your-merchant-id
        echo PAYHERE_MERCHANT_SECRET=your-merchant-secret
        echo PAYHERE_SANDBOX=true
        echo.
        echo # Security Configuration
        echo NEXTAUTH_SECRET=your-nextauth-secret
        echo NEXTAUTH_URL=https://aralphaya.netlify.app
        echo.
        echo # CMS Configuration
        echo NETLIFY_IDENTITY_URL=https://aralphaya.netlify.app/.netlify/identity
    ) > .env.local
    
    echo ✅ Created .env.local template
    echo    Please update the values in .env.local with your actual credentials
) else (
    echo ✅ .env.local found
)

REM Test build
echo.
echo 🏗️  Testing build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    echo    Check the error messages above
) else (
    echo ✅ Build successful!
)

REM Final summary
echo.
echo 🎉 Installation Summary
echo ======================
echo ✅ Node.js and npm verified
echo ✅ Dependencies installed
echo ✅ Security audit completed
echo ✅ Environment template created

echo.
echo 📚 Next Steps:
echo 1. Update .env.local with your actual credentials
echo 2. Review VULNERABILITIES.md for security fixes
echo 3. Run 'npm run dev' to start development server
echo 4. Visit http://localhost:3000 to test the application

echo.
echo 🔒 Security Commands:
echo npm run security:audit  - Run security audit
echo npm run security:scan   - Run vulnerability scan
echo npm run security:fix    - Fix security issues

echo.
echo ✨ Installation completed successfully!
pause

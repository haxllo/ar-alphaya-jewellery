# Installation Guide for AR Alphaya Jewellery
*Security Dependencies & Setup*

---

## 🚀 **Prerequisites**

### 1. Install Node.js
Download and install Node.js from the official website:
- **Recommended Version**: Node.js 18.x or higher
- **Download**: https://nodejs.org/
- **Verify Installation**:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Git (if not already installed)
- **Download**: https://git-scm.com/
- **Verify Installation**:
  ```bash
  git --version
  ```

---

## 📦 **Install Dependencies**

### Step 1: Navigate to Project Directory
```bash
cd C:\Users\mshab\Documents\ar-alphaya-jewellery
```

### Step 2: Install All Dependencies
```bash
npm install
```

### Step 3: Install Security Dependencies (Already Added to package.json)
The following security packages have been added to your `package.json`:

#### **Security Dependencies Added:**
- `zod` - Input validation and schema validation
- `helmet` - Security headers middleware
- `express-rate-limit` - API rate limiting
- `winston` - Security logging
- `crypto` - Cryptographic functions

#### **Security Dev Dependencies Added:**
- `eslint-plugin-security` - Security linting rules
- `snyk` - Vulnerability scanning

### Step 4: Verify Installation
```bash
npm list --depth=0
```

---

## 🔧 **Environment Setup**

### Step 1: Create Environment File
Create a `.env.local` file in the project root:

```bash
# Copy the example file
copy .env.example .env.local
```

### Step 2: Configure Environment Variables
Add the following variables to `.env.local`:

```env
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

# Database Configuration (if using external DB)
DATABASE_URL=your-database-url
DATABASE_SSL=true

# Security Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://aralphaya.netlify.app

# CMS Configuration
NETLIFY_IDENTITY_URL=https://aralphaya.netlify.app/.netlify/identity
```

---

## 🛠️ **Development Commands**

### Basic Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Security Commands
```bash
# Run security audit
npm run security:audit

# Run vulnerability scan
npm run security:scan

# Fix security issues
npm run security:fix
```

### Testing Commands
```bash
# Run all tests
npm run test:all

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## 🔒 **Security Setup**

### Step 1: Configure Security Headers
The security headers are already configured in `next.config.mjs`. Verify they include:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### Step 2: Configure ESLint Security Rules
Add to your `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:security/recommended"
  ],
  "plugins": ["security"]
}
```

---

## 🚀 **Deployment**

### Netlify Deployment
Your project is already configured for Netlify deployment:

1. **Automatic Deployment**: Connected to Git repository
2. **Build Command**: `npm run build`
3. **Publish Directory**: `.next`
4. **Environment Variables**: Configure in Netlify dashboard

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (if using Netlify CLI)
netlify deploy --prod
```

---

## 🔍 **Verification Steps**

### 1. Check Dependencies
```bash
npm list --depth=0
```

### 2. Run Security Audit
```bash
npm run security:audit
```

### 3. Test Build
```bash
npm run build
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🆘 **Troubleshooting**

### Common Issues

#### 1. Node.js Not Found
- **Solution**: Install Node.js from https://nodejs.org/
- **Verify**: `node --version`

#### 2. npm Command Not Found
- **Solution**: Node.js installation includes npm
- **Verify**: `npm --version`

#### 3. Permission Errors
- **Solution**: Run PowerShell as Administrator
- **Alternative**: Use `npx` instead of global installs

#### 4. Build Errors
- **Solution**: Clear cache and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 5. Environment Variables Not Loading
- **Solution**: Ensure `.env.local` is in project root
- **Check**: File is not in `.gitignore`

---

## 📚 **Next Steps**

1. **Review Security Vulnerabilities**: Check `VULNERABILITIES.md`
2. **Configure Environment Variables**: Set up all required secrets
3. **Run Security Audit**: `npm run security:audit`
4. **Test Application**: `npm run dev`
5. **Deploy to Production**: Follow deployment guide

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review the `VULNERABILITIES.md` file
3. Check the project's `README.md` for additional information
4. Ensure all prerequisites are installed correctly

---

*This guide ensures your AR Alphaya Jewellery project is properly set up with all security dependencies and ready for development.*

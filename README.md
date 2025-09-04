# AR Alphaya Jewellery

A modern, customizable jewelry e-commerce website built with Next.js, TypeScript, and Tailwind CSS. This project is designed to allow easy product management without coding through a headless CMS system.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Content Management**: Decap CMS (formerly Netlify CMS) for easy product management
- **Authentication**: Complete Auth0 integration with user profiles and protected pages
- **Shopping Cart**: Advanced cart functionality with recommendations and size selection
- **Payment Integration**: PayHere payment gateway for Sri Lankan customers
- **User Reviews**: Complete review and rating system with verified purchases
- **Multi-Currency**: Support for 9 international currencies with live conversion
- **Product Recommendations**: Smart AI-powered product suggestions
- **Newsletter System**: Advanced email subscription with preferences
- **Size Guide**: Professional jewelry sizing guide with international standards
- **Responsive Design**: Mobile-first design optimized for all devices
- **SEO Optimized**: Complete SEO with meta tags and structured data

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/[auth0]/   # Auth0 authentication routes
│   ├── collections/        # Product collections pages
│   ├── products/           # Individual product pages
│   ├── profile/           # User profile page (protected)
│   ├── cart/              # Advanced shopping cart
│   ├── checkout/          # PayHere checkout integration
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── product/          # Product-related components
│   ├── cart/             # Cart-related components
│   ├── reviews/          # Review and rating components
│   ├── recommendations/  # Product recommendation components
│   └── marketing/        # Newsletter and marketing components
├── lib/                  # Utility functions and configurations
│   ├── store/            # Zustand store for state management
│   ├── cms/              # CMS utility functions
│   ├── recommendations.ts# Smart product recommendations
│   ├── reviews.ts        # Review system service
│   ├── newsletter.ts     # Newsletter management
│   ├── currency.ts       # Multi-currency support
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── data/                 # Sample data and CMS content
└── public/               # Static assets
    ├── admin/            # Decap CMS admin interface
    └── images/           # Product images and assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ar-alphaya-jewellery
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
# Create .env.local with Auth0 credentials
touch .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Content Management

### Adding Products

1. Navigate to `/admin` after deployment
2. Login with Netlify Identity
3. Add products through the visual interface
4. Images will be automatically optimized

### Product Fields

- Name
- Description
- Price
- Images
- Category
- Sizes available
- Materials
- SKU

## 🛒 Shopping Cart

The cart functionality includes:
- Add/remove products
- Size selection
- Quantity management
- Persistent across pages
- Local storage backup

## 🎨 Customization

### Colors and Themes

**Current Color Scheme: Professional Black & White**  
*Updated September 4, 2025 to match original website aesthetics*

The website uses a clean, professional black and white theme:

**AR Alphaya Brand Colors:**
- **Background**: #ffffff (Pure white)
- **Foreground**: #121212 (Near black)  
- **Border**: #e5e7eb (Light gray)
- **Accent**: #121212 (Black)
- **Button**: #121212 background, #ffffff text
- **Hover States**: #1f2937 (Dark gray)
- **Links**: #374151 normal, #121212 hover

**Legacy Colors (replaced):**
- Previous grayscale palette with gradient backgrounds has been updated to the clean black/white theme

To customize colors, update `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: "#your-lightest-color",
    // ... update other shades
    800: "#your-darkest-color",
  }
}
```

### Typography

Custom fonts can be added in `app/layout.tsx` and configured in the Tailwind config.

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Enable Netlify Identity for admin access
5. Configure PayHere integration

### Environment Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://aralphaya.netlify.app
NEXT_PUBLIC_SITE_NAME="AR Alphaya Jewellery"

# Auth0 Authentication
AUTH0_SECRET="your-secret-key"
AUTH0_BASE_URL="https://aralphaya.netlify.app"
AUTH0_ISSUER_BASE_URL="https://your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_SCOPE="openid profile email"

# PayHere Payment Gateway
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Project Status

**Current Version:** Production Ready with Auth0  
**Last Updated:** September 4, 2025  
**Development Status:** ✅ Complete with full authentication  
**Live Site:** https://aralphaya.netlify.app  
**GitHub Repository:** https://github.com/haxllo/ar-alphaya-jewellery

### Recent Updates:
- ✅ Complete Auth0 authentication integration
- ✅ Protected user profiles and checkout pages
- ✅ Advanced shopping cart with recommendations
- ✅ Multi-currency support system
- ✅ Professional review and rating system
- ✅ Newsletter subscription system
- ✅ Comprehensive size guide modal
- ✅ PayHere payment gateway integration
- ✅ Professional black/white design theme
- ✅ Complete brand integration and optimization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email info@aralphayajewellery.com or create an issue in this repository.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Decap CMS Documentation](https://decapcms.org/docs)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity)

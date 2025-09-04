# AR Alphaya Jewellery

A modern, customizable jewelry e-commerce website built with Next.js, TypeScript, and Tailwind CSS. This project is designed to allow easy product management without coding through a headless CMS system.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Content Management**: Decap CMS (formerly Netlify CMS) for easy product management
- **Shopping Cart**: Global cart functionality with size selection across all pages
- **Responsive Design**: Mobile-first design optimized for all devices
- **SEO Optimized**: Next.js SEO with meta tags and structured data
- **Authentication Ready**: Prepared for Netlify Identity integration
- **Payment Ready**: Structure prepared for PayHere integration
- **Analytics Ready**: Built-in hooks for tracking user activities

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── collections/        # Product collections pages
│   ├── products/           # Individual product pages
│   ├── cart/              # Shopping cart page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── product/          # Product-related components
│   └── cart/             # Cart-related components
├── lib/                  # Utility functions and configurations
│   ├── store/            # Zustand store for state management
│   ├── cms/              # CMS utility functions
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
cp .env.example .env.local
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

```
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-merchant-id
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

**Current Version:** Production Ready  
**Last Updated:** September 4, 2025  
**Development Status:** ✅ Complete with brand integration  
**GitHub Repository:** https://github.com/haxllo/ar-alphaya-jewellery

### Recent Updates:
- ✅ Complete color scheme overhaul (black/white theme)
- ✅ Brand logo integration (BRAND.svg, LOGO1.png, LOGO2.png)
- ✅ Responsive logo sizing across all devices
- ✅ Bug fixes for collection route generation
- ✅ Professional favicon and metadata setup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email info@aralphayajewellery.com or create an issue in this repository.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Decap CMS Documentation](https://decapcms.org/docs)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity)

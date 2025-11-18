# SEO Implementation Guide - AR Alphaya Jewellery

## ✅ Completed

### 1. Google Search Console
- ✅ Domain verified
- ✅ Sitemap submitted: https://www.aralphayajewellery.com/sitemap.xml
- ✅ Requested indexing for key pages

### 2. Google Analytics
- ✅ Implemented with GA ID: G-3T72NWGT2W
- ✅ Added to layout.tsx
- ✅ Environment variable added

### 3. Metadata & Open Graph
- ✅ Open Graph metadata for Facebook/LinkedIn
- ✅ Twitter Card metadata
- ✅ SEO keywords added
- ✅ Author and publisher metadata

### 4. Structured Data
- ✅ Product schema with prices and availability
- ✅ ProductList schema for collections
- ✅ Breadcrumb schema for navigation
- ✅ LocalBusiness schema with Kandy geo-coordinates
- ✅ Organization schema with contact info
- ✅ Review/Rating schema on products

---

## 📋 Action Required

### Create OG (Open Graph) Image

**File:** `public/images/og-image.jpg`

**Specifications:**
- **Size:** 1200 x 630 pixels (exact)
- **Format:** JPG or PNG
- **File size:** < 300 KB (optimized)

**Design Requirements:**
```
┌─────────────────────────────────────────┐
│                                         │
│        [Your Logo - LOGO1.png]          │
│                                         │
│     AR ALPHAYA JEWELLERY               │
│                                         │
│   Bespoke Gemstone Jewellery           │
│   Handcrafted in Kandy, Sri Lanka      │
│                                         │
│   [Beautiful jewelry product photo]     │
│                                         │
└─────────────────────────────────────────┘
```

**Design Tips:**
1. Use high-quality jewelry photo as background
2. Add semi-transparent overlay for text readability
3. Use your brand colors
4. Ensure text is readable on mobile (preview at 400px width)
5. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/

**Tools to Create:**
- [Canva](https://www.canva.com) - Free, templates available
- [Figma](https://www.figma.com) - Professional design
- Photoshop - Full control

**Template Settings (Canva):**
- Search: "Facebook Post" template
- Resize to: Custom 1200 x 630 px
- Add your logo + jewelry photo + text
- Export as JPG (high quality)

---

## 🔍 Testing Your SEO

### 1. Test Open Graph Tags
- **Facebook:** https://developers.facebook.com/tools/debug/
  - Enter: https://www.aralphayajewellery.com
  - Click "Scrape Again" to refresh cache
- **LinkedIn:** https://www.linkedin.com/post-inspector/
  - Enter: https://www.aralphayajewellery.com

### 2. Test Twitter Cards
- **Twitter:** https://cards-dev.twitter.com/validator
  - Enter: https://www.aralphayajewellery.com

### 3. Test Structured Data
- **Google Rich Results:** https://search.google.com/test/rich-results
  - Test URL: https://www.aralphayajewellery.com/products/[any-product]
  - Should show: Product, Breadcrumb data

### 4. Test Mobile-Friendliness
- **Google Mobile Test:** https://search.google.com/test/mobile-friendly
  - Test: https://www.aralphayajewellery.com

### 5. Test Page Speed
- **PageSpeed Insights:** https://pagespeed.web.dev/
  - Test: https://www.aralphayajewellery.com
  - Aim for: 90+ score

---

## 📊 Monitoring (Weekly)

### Google Search Console
Check every week:

1. **Performance Report**
   - Total clicks
   - Total impressions
   - Average CTR (target: > 2%)
   - Average position (target: < 20)

2. **Page Indexing Report**
   - Indexed pages count
   - Any errors or warnings

3. **Core Web Vitals**
   - LCP (Largest Contentful Paint) - target: < 2.5s
   - FID (First Input Delay) - target: < 100ms
   - CLS (Cumulative Layout Shift) - target: < 0.1

4. **Mobile Usability**
   - Check for mobile issues

### Google Analytics
Monitor daily/weekly:

1. **Realtime Report**
   - Active users right now
   - Top pages being viewed

2. **Acquisition Report**
   - Traffic sources (Organic, Direct, Referral, Social)
   - Which channels drive most traffic

3. **Engagement Report**
   - Most viewed products
   - Average session duration
   - Bounce rate (aim for < 60%)

4. **Conversions**
   - Track orders placed
   - Revenue from each source

---

## 🎯 Next Optimizations (Optional)

### 1. Add Product Reviews
- Implement review collection
- Add review structured data
- Display star ratings in search results

### 2. Create Blog Content
- "Guide to Sri Lankan Gemstones"
- "How to Care for Your Gemstone Jewelry"
- "The Story Behind Each Piece"
- Helps with long-tail keywords + SEO

### 3. Improve Product Descriptions
- Add detailed material info
- Include gemstone origin stories
- Add care instructions
- Use keywords naturally

### 4. Build Backlinks
- Get featured in Sri Lankan lifestyle blogs
- Partner with wedding planners
- Submit to jewelry directories
- Instagram collaborations

### 5. Local SEO
- Create Google Business Profile
- Get listed on Sri Lankan business directories
- Encourage customer reviews
- Add location-based keywords

---

## 📝 Checklist for Production

Before going live:

- [ ] Add `NEXT_PUBLIC_GA_ID=G-3T72NWGT2W` to Vercel env variables
- [ ] Create and upload `og-image.jpg` to `public/images/`
- [ ] Test OG image with Facebook Debugger
- [ ] Test structured data with Rich Results Test
- [ ] Test mobile-friendliness
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for homepage + top 10 products
- [ ] Set up Google Analytics property
- [ ] Link Search Console to Analytics
- [ ] Set up conversion tracking for purchases

---

## 🚀 Expected Results

### Week 1-2
- Site appears in Google Search for brand name
- Basic indexing complete
- Analytics tracking active

### Week 3-4
- Start appearing for product keywords
- 10-50 impressions per day
- 1-5 clicks per day

### Month 2-3
- 100-500 impressions per day
- 10-50 clicks per day
- Some product pages ranking
- Social shares showing OG images

### Month 4-6
- 500-2000 impressions per day
- 50-200 clicks per day
- Multiple keywords ranking
- Increased organic traffic
- Better conversion rate

---

## 📞 Support Resources

- **Google Search Console Help:** https://support.google.com/webmasters
- **Google Analytics Help:** https://support.google.com/analytics
- **Schema.org Documentation:** https://schema.org/docs/schemas.html
- **Next.js SEO Guide:** https://nextjs.org/learn/seo/introduction-to-seo

---

Last updated: 2025-11-18

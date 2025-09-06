# TopPromoBar Design Specification

## Overview
A 39px sticky slideshow banner component that appears at the very top of every page with rotating promotional messages, navigation buttons, and interactive links.

## Visual Design

### Dimensions
- **Height**: Exactly 39px on all breakpoints
- **Width**: 100% viewport width
- **Position**: Sticky top-0, z-index 60

### Styling
- **Background**: Shiny black with gradient effect
  ```css
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #1a1a1a 75%, #000000 100%)
  boxShadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.05)
  ```
- **Text**: Ultra-slim white font
  - `font-thin text-xs font-light tracking-wide`
  - Pure white color (`text-white`)
- **Layout**: `flex items-center justify-between`

## Content

### Messages (Short, No Emojis)
```
• Free shipping island-wide across Sri Lanka
• Follow @ar_alphaya_jewellery on Instagram  
• Custom jewelry design services available
• New handcrafted arrivals weekly
```

### Interactive Links
- **Instagram message** → Links to `https://www.instagram.com/ar_alphaya_jewellery/`
- **Custom jewelry message** → Links to `/contact`
- Hover effects: `hover:underline hover:text-gray-300 hover:opacity-80`

## Navigation Features

### Navigation Buttons (< >)
- **Position**: Left and right sides (40px wide each)
- **Icons**: 3x3px chevron SVGs
- **Colors**: `text-white/60` → `text-white` on hover
- **Background**: `hover:bg-white/10` on hover
- **Function**: Manual navigation through messages

### Dot Indicators
- **Position**: Bottom center
- **Size**: 1x1px dots
- **Colors**: Active = `bg-white`, Inactive = `bg-white/40`
- **Function**: Click to jump to specific message
- **Accessibility**: `aria-label="Go to message ${index + 1}"`

## Functionality

### Auto-Rotation
- **Duration**: 4 seconds between transitions
- **Transition**: Fade effect (300ms opacity transition)
- **Pause**: On hover for accessibility
- **Loop**: Continuous cycling through messages

### Manual Navigation
- **Previous Button**: Cycles to previous message (wraps around)
- **Next Button**: Cycles to next message (wraps around)
- **Dot Indicators**: Direct jump to specific message
- **Transition**: Same fade effect (150ms for manual navigation)

## Technical Implementation

### Component Structure
```tsx
interface TopPromoBarProps {
  messages?: string[]
  duration?: number // milliseconds
}

// Layout: Previous Button | Message Content | Next Button
//         Dot Indicators (bottom center)
```

### State Management
```tsx
const [currentIndex, setCurrentIndex] = useState(0)
const [isHovered, setIsHovered] = useState(false)
const [fadeClass, setFadeClass] = useState('opacity-100')
```

### Accessibility
- `role="status"`
- `aria-live="polite"`
- `aria-atomic="true"`
- Individual button labels for navigation

## Integration Requirements

### Layout Integration
- **Position**: In root layout (`src/app/layout.tsx`)
- **Order**: TopPromoBar → Header → Main Content → Footer
- **Header Adjustment**: Header should be `sticky top-[39px]` to account for bar height

### Configuration
- **Data Source**: `src/data/site.json` → `promoMessages` array
- **CMS Editable**: Via Decap CMS "Site Settings" → "Promotional Messages"
- **Fallback**: Default messages if config fails

### CSS Classes Used
```css
/* Main container */
.bg-gradient-to-r .from-gray-900 .via-black .to-gray-900
.text-white .h-[39px] .w-full .flex .items-center .justify-between
.text-xs .font-thin .overflow-hidden .sticky .top-0 .z-[60] .shadow-inner

/* Navigation buttons */
.flex .items-center .justify-center .w-10 .h-full
.hover:bg-white/10 .transition-colors .duration-200 .group

/* Message content */
.flex-1 .flex .items-center .justify-center
.transition-opacity .duration-300 .px-4 .text-center
.whitespace-nowrap .overflow-hidden .text-ellipsis .max-w-full
.font-light .tracking-wide

/* Dots */
.absolute .bottom-1 .left-1/2 .transform .-translate-x-1/2 .flex .space-x-1
.w-1 .h-1 .rounded-full .transition-colors .duration-300
```

## Files Created/Modified

### New Files
- `src/components/marketing/TopPromoBar.tsx` - Main component
- `src/components/marketing/TopPromoBar.backup.tsx` - Backup copy

### Modified Files
- `src/app/layout.tsx` - Integration into root layout
- `src/components/layout/header.tsx` - Adjusted sticky positioning
- `src/data/site.json` - Added promoMessages array
- `src/lib/cms/content.ts` - Added getSiteConfig function
- `WARP.md` - Updated documentation

## Future Implementation Notes

1. **Server/Client Hydration**: May need to handle SSR carefully
2. **Performance**: Component is lightweight but consider lazy loading if needed
3. **Customization**: Colors and timing easily adjustable via props
4. **Analytics**: Could add tracking for message clicks and engagement
5. **A/B Testing**: Message effectiveness can be measured

## Brand Alignment
- **Colors**: Matches AR Alphaya's black/white professional theme
- **Typography**: Ultra-slim font aligns with modern jewelry aesthetic
- **Content**: Focuses on key business benefits (shipping, social, custom orders)
- **Interaction**: Smooth, premium feel matching jewelry brand quality

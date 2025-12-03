export type SizeOption = 'S' | 'M' | 'L' | 'XL';

export type GemstoneOption = {
  name: string;
  value: string;
  priceAdjustment?: number; // price difference from base price in LKR cents
  description?: string;
  available?: boolean;
};

export type PlatingOption = {
  type: '925-silver' | '24k-gold' | '18k-rose-gold';
  label: string;
  priceAdjustment: number; // 0, 5000, 3000
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // price in LKR cents / or integer
  currency?: string; // default LKR
  images: string[]; // image URLs or paths under /public/images
  category: string; // collection handle
  sku?: string;
  materials?: string[];
  sizes?: SizeOption[];
  gemstones?: GemstoneOption[]; // available gemstone options
  plating?: PlatingOption[]; // available plating finishes
  weight?: number; // weight in grams
  dimensions?: string; // dimensions description
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  availability?: string; // e.g. made-to-order, ready-to-ship, sample
  leadTime?: string; // human readable lead time info
  customizable?: boolean;
  statusNote?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  gemstone?: string;
  plating?: string;
  image?: string;
};

export type Collection = {
  handle: string;
  title: string;
  description?: string;
  image?: string;
};

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  createdAt: string;
  verified?: boolean; // verified purchase
  helpful?: number; // helpful votes count
};

export type ReviewSummary = {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

// Wishlist types
export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  materials?: string[];
  image?: string;
  addedAt: string;
};

export type WishlistState = {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
};


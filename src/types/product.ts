export type SizeOption = {
  label: string;
  value: string;
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
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
};

export type Collection = {
  handle: string;
  title: string;
  description?: string;
  image?: string;
};


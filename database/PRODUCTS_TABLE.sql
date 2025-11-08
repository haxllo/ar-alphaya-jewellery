-- Products Table Schema for AR Alphaya Jewellery
-- This replaces the JSON file-based product storage with a proper database

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  product_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Pricing
  price INTEGER NOT NULL CHECK (price >= 0),
  currency VARCHAR(10) DEFAULT 'LKR',
  
  -- Media (Uploadcare URLs)
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Categorization
  category VARCHAR(100) NOT NULL,
  sku VARCHAR(100),
  materials TEXT[],
  tags TEXT[],
  
  -- Physical Properties
  weight DECIMAL(10,2), -- in grams
  dimensions VARCHAR(255),
  
  -- Variants
  sizes JSONB DEFAULT '[]'::jsonb, -- [{label, value}]
  gemstones JSONB DEFAULT '[]'::jsonb, -- [{name, value, priceAdjustment, description, available}]
  
  -- Status
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  
  -- Availability Info
  availability VARCHAR(100),
  lead_time VARCHAR(100),
  customizable BOOLEAN DEFAULT false,
  status_note TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock) WHERE in_stock = true;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_materials ON public.products USING GIN(materials);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING GIN(
  to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(description, '') || ' ' || 
    coalesce(sku, '')
  )
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "Anyone can view published products"
  ON public.products
  FOR SELECT
  USING (status = 'published');

-- Admins can do everything
CREATE POLICY "Admins can manage all products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

GRANT EXECUTE ON FUNCTION public.generate_slug(TEXT) TO authenticated;

-- Product categories reference table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Anyone can view categories"
  ON public.product_categories
  FOR SELECT
  USING (active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON public.product_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Insert default categories
INSERT INTO public.product_categories (name, slug, display_order) VALUES
  ('Rings', 'rings', 1),
  ('Earrings', 'earrings', 2),
  ('Pendants', 'pendants', 3),
  ('Bracelets & Bangles', 'bracelets-bangles', 4)
ON CONFLICT (slug) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.products IS 'Main products table for jewellery inventory';
COMMENT ON COLUMN public.products.images IS 'Array of Uploadcare CDN URLs';
COMMENT ON COLUMN public.products.status IS 'Draft products are not visible to public';
COMMENT ON COLUMN public.products.gemstones IS 'Array of gemstone options with pricing';


-- Dispensaries table
CREATE TABLE public.dispensaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  description TEXT,
  image_url TEXT,
  delivery_fee NUMERIC(5,2) DEFAULT 3.99,
  delivery_time TEXT DEFAULT '30-45 min',
  is_open BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dispensaries ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own dispensaries
CREATE POLICY "Owners can manage their dispensaries"
  ON public.dispensaries FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Everyone can view dispensaries (for browsing)
CREATE POLICY "Anyone can view dispensaries"
  ON public.dispensaries FOR SELECT
  USING (true);

-- Strain type enum
CREATE TYPE public.strain_type AS ENUM ('Sativa', 'Indica', 'Hybrid');

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispensary_id UUID NOT NULL REFERENCES public.dispensaries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  strain strain_type NOT NULL DEFAULT 'Hybrid',
  thc TEXT,
  price NUMERIC(8,2) NOT NULL,
  weight TEXT,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Owners can manage products in their dispensaries
CREATE POLICY "Owners can manage their products"
  ON public.products FOR ALL
  USING (
    dispensary_id IN (SELECT id FROM public.dispensaries WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    dispensary_id IN (SELECT id FROM public.dispensaries WHERE owner_id = auth.uid())
  );

-- Everyone can view available products
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Updated_at triggers
CREATE TRIGGER update_dispensaries_updated_at
  BEFORE UPDATE ON public.dispensaries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

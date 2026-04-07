
-- Hero Banners
CREATE TABLE public.hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero banners viewable by everyone" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero banners" ON public.hero_banners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Promo Banners
CREATE TABLE public.promo_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  button_text text,
  button_link text,
  bg_color text DEFAULT '#16a34a',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promo banners viewable by everyone" ON public.promo_banners FOR SELECT USING (true);
CREATE POLICY "Admins can manage promo banners" ON public.promo_banners FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Homepage Testimonials
CREATE TABLE public.homepage_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  avatar text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials viewable by everyone" ON public.homepage_testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can manage testimonials" ON public.homepage_testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Featured Items (products or vendors manually selected)
CREATE TABLE public.featured_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL DEFAULT 'product', -- 'product' or 'vendor'
  item_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured items viewable by everyone" ON public.featured_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage featured items" ON public.featured_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON public.hero_banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_banners_updated_at BEFORE UPDATE ON public.promo_banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Campaigns table for vendor-specific promotions/discounts
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Campaign-product junction table
CREATE TABLE public.campaign_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, product_id)
);

-- Promo codes table
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  min_order_amount numeric DEFAULT 0,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, code)
);

-- RLS for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Vendors can manage own campaigns" ON public.campaigns FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = campaigns.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Vendors can update own campaigns" ON public.campaigns FOR UPDATE USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = campaigns.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Vendors can delete own campaigns" ON public.campaigns FOR DELETE USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = campaigns.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Admins can manage all campaigns" ON public.campaigns FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for campaign_products
ALTER TABLE public.campaign_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign products viewable by everyone" ON public.campaign_products FOR SELECT USING (true);
CREATE POLICY "Vendors can manage own campaign products" ON public.campaign_products FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM campaigns JOIN vendors ON vendors.id = campaigns.vendor_id WHERE campaigns.id = campaign_products.campaign_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Vendors can delete own campaign products" ON public.campaign_products FOR DELETE USING (EXISTS (SELECT 1 FROM campaigns JOIN vendors ON vendors.id = campaigns.vendor_id WHERE campaigns.id = campaign_products.campaign_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Admins can manage all campaign products" ON public.campaign_products FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promo codes viewable by everyone" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Vendors can manage own promo codes" ON public.promo_codes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = promo_codes.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Vendors can update own promo codes" ON public.promo_codes FOR UPDATE USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = promo_codes.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Vendors can delete own promo codes" ON public.promo_codes FOR DELETE USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = promo_codes.vendor_id AND vendors.user_id = auth.uid()));
CREATE POLICY "Admins can manage all promo codes" ON public.promo_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

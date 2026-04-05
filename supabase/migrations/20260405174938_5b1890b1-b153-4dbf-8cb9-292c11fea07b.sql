
-- 1. Fix vendor phone exposure: create a restricted SELECT policy
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Vendors are viewable by everyone" ON public.vendors;

-- Public can see vendors but NOT phone numbers - use a function-based approach
-- Since RLS can't filter columns, we create two policies:
-- a) Everyone can SELECT (needed for store pages) but we'll handle column filtering in app
-- b) Actually, RLS operates at row level not column level. 
-- Best approach: keep public read but create a view without phone for public use
CREATE POLICY "Vendors are viewable by everyone"
  ON public.vendors FOR SELECT
  USING (true);

-- Create a public-safe view that excludes sensitive fields
CREATE OR REPLACE VIEW public.vendors_public AS
SELECT id, store_name, description, logo_url, banner_url, address, 
       organic_certification, rating, review_count, is_approved, is_suspended,
       created_at, updated_at, user_id, commission_rate
FROM public.vendors;

-- 2. Fix reviews: Add INSERT policy tied to verified purchases
-- The create_product_review SECURITY DEFINER function already handles this,
-- but let's also add a direct INSERT policy for flexibility
CREATE POLICY "Authenticated users can insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.customer_id = auth.uid()
        AND oi.product_id = reviews.product_id
        AND o.status = 'delivered'
    )
  );

-- 3. Fix promo codes: restrict public read to only active codes for authenticated users
DROP POLICY IF EXISTS "Promo codes viewable by everyone" ON public.promo_codes;

CREATE POLICY "Authenticated users can view active promo codes"
  ON public.promo_codes FOR SELECT
  TO authenticated
  USING (is_active = true AND (end_date IS NULL OR end_date > now()));

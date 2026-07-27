
-- Restrict admin-only policies to authenticated so anon SELECT does not evaluate has_role
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;
CREATE POLICY "Admins can manage vendors" ON public.vendors
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Also scope vendor-owner policies to authenticated to avoid anon-side has_role checks via view
DROP POLICY IF EXISTS "Vendors can delete own products" ON public.products;
CREATE POLICY "Vendors can delete own products" ON public.products
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = products.vendor_id AND vendors.user_id = auth.uid()));

DROP POLICY IF EXISTS "Vendors can update own products" ON public.products;
CREATE POLICY "Vendors can update own products" ON public.products
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = products.vendor_id AND vendors.user_id = auth.uid()));

DROP POLICY IF EXISTS "Vendors can manage own products" ON public.products;
CREATE POLICY "Vendors can manage own products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM vendors WHERE vendors.id = products.vendor_id AND vendors.user_id = auth.uid()));

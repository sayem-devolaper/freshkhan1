
-- 1. Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.calculate_commission(numeric, numeric) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.confirm_order_payment(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_product_review(uuid, integer, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.register_as_vendor(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.place_order(uuid, jsonb, text, uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.place_order(uuid, jsonb, text, uuid, text, text, text) FROM PUBLIC, anon;

-- 2. Vendors: restrict SELECT on base table (public reads use vendors_public view)
DROP POLICY IF EXISTS "Vendors are viewable by everyone" ON public.vendors;
CREATE POLICY "Vendor owners and admins can view vendor row"
  ON public.vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. Vendor self-update: replace fragile subquery policy with trigger-enforced immutability
DROP POLICY IF EXISTS "Vendors can update own store" ON public.vendors;
CREATE POLICY "Vendors can update own store"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.enforce_vendor_immutable_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_suspended IS DISTINCT FROM OLD.is_suspended
     OR NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     OR NEW.rating IS DISTINCT FROM OLD.rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Not authorized to modify protected vendor fields';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_vendor_immutable_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS vendors_immutable_fields ON public.vendors;
CREATE TRIGGER vendors_immutable_fields
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.enforce_vendor_immutable_fields();

-- 4. Storage: scope image uploads to caller's vendor folder (or admin)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Vendors can upload to own product folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR (
        (storage.foldername(name))[1] = 'products'
        AND (storage.foldername(name))[2] IN (
          SELECT id::text FROM public.vendors WHERE user_id = auth.uid()
        )
      )
    )
  );

-- 5. Storage: remove broad public listing SELECT policy (public URLs still work via CDN)
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
CREATE POLICY "Owners and admins can read image objects"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  );

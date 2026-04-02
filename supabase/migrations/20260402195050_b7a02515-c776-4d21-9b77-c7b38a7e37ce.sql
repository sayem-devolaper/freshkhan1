
-- 1. Fix vendor self-approve: replace permissive vendor update policy with one that guards admin-only columns
DROP POLICY IF EXISTS "Vendors can update own store" ON public.vendors;

CREATE POLICY "Vendors can update own store"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_approved = (SELECT v.is_approved FROM public.vendors v WHERE v.id = vendors.id)
    AND is_suspended = (SELECT v.is_suspended FROM public.vendors v WHERE v.id = vendors.id)
    AND commission_rate = (SELECT v.commission_rate FROM public.vendors v WHERE v.id = vendors.id)
    AND rating = (SELECT v.rating FROM public.vendors v WHERE v.id = vendors.id)
    AND review_count = (SELECT v.review_count FROM public.vendors v WHERE v.id = vendors.id)
  );

-- 2. Fix storage: restrict upload paths to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

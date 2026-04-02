
-- 1. Fix profiles: restrict SELECT to owner + admins
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Fix storage: add ownership checks to DELETE and UPDATE
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' AND owner = auth.uid());

DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND owner = auth.uid());

-- 3. Fix reviews: require purchase before reviewing
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;

CREATE OR REPLACE FUNCTION public.create_product_review(
  p_product_id uuid, p_rating int, p_comment text DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.customer_id = auth.uid()
      AND oi.product_id = p_product_id
      AND o.status = 'delivered'
  ) THEN
    RAISE EXCEPTION 'Must purchase product before reviewing';
  END IF;
  INSERT INTO reviews (product_id, user_id, rating, comment)
  VALUES (p_product_id, auth.uid(), p_rating, p_comment);
END;
$$;

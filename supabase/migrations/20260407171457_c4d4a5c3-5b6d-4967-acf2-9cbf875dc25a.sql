
-- Drop and recreate the vendors_public view without commission_rate and phone
DROP VIEW IF EXISTS public.vendors_public;

CREATE VIEW public.vendors_public AS
  SELECT id, store_name, description, logo_url, banner_url, address,
         organic_certification, rating, review_count, is_approved, is_suspended,
         created_at, updated_at, user_id
  FROM vendors;

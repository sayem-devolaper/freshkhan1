
-- Drop the security definer view and recreate as security invoker
DROP VIEW IF EXISTS public.vendors_public;

CREATE VIEW public.vendors_public 
WITH (security_invoker = true) AS
SELECT id, store_name, description, logo_url, banner_url, address, 
       organic_certification, rating, review_count, is_approved, is_suspended,
       created_at, updated_at, user_id, commission_rate
FROM public.vendors;

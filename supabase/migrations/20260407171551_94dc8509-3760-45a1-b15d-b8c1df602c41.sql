
DROP POLICY IF EXISTS "Public can view basic vendor info" ON public.vendors;

-- Grant SELECT on the view to anon and authenticated roles so public pages can query it
GRANT SELECT ON public.vendors_public TO anon, authenticated;

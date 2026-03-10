CREATE OR REPLACE FUNCTION public.register_as_vendor(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
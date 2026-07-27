
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image text,
  author text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
ON public.blog_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('popup_enabled', 'false'),
  ('popup_image_url', ''),
  ('popup_link', '')
ON CONFLICT (key) DO NOTHING;


-- CMS pages table
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pages TO anon;
GRANT SELECT ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert pages"
  ON public.pages FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pages"
  ON public.pages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pages"
  ON public.pages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default pages
INSERT INTO public.pages (slug, title, content, meta_title, meta_description, sort_order) VALUES
  ('about', 'আমাদের সম্পর্কে', '<h2>আমাদের সম্পর্কে</h2><p>ফ্রেশ খান বাংলাদেশের শীর্ষস্থানীয় অর্গানিক মার্কেটপ্লেস।</p>', 'আমাদের সম্পর্কে — ফ্রেশ খান', 'ফ্রেশ খান সম্পর্কে জানুন — বাংলাদেশের বিশ্বস্ত অর্গানিক পণ্যের মার্কেটপ্লেস।', 1),
  ('privacy', 'প্রাইভেসি পলিসি', '<h2>প্রাইভেসি পলিসি</h2><p>আপনার তথ্যের গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।</p>', 'প্রাইভেসি পলিসি — ফ্রেশ খান', 'ফ্রেশ খান কীভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করে।', 2),
  ('terms', 'নিয়ম ও শর্তাবলী', '<h2>নিয়ম ও শর্তাবলী</h2><p>ফ্রেশ খান ব্যবহারের নিয়ম ও শর্তাবলী।</p>', 'নিয়ম ও শর্তাবলী — ফ্রেশ খান', 'ফ্রেশ খান ব্যবহারের নিয়ম ও শর্তাবলী পড়ুন।', 3),
  ('faq', 'সাধারণ প্রশ্নোত্তর', '<h2>প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2><p><strong>প্রশ্ন:</strong> কীভাবে অর্ডার করব?<br/><strong>উত্তর:</strong> পছন্দের পণ্য কার্টে যোগ করে চেকআউট করুন।</p>', 'FAQ — ফ্রেশ খান', 'ফ্রেশ খান সম্পর্কিত সাধারণ প্রশ্ন ও উত্তর।', 4);

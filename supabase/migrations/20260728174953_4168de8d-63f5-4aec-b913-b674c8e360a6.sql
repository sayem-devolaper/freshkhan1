
ALTER TABLE public.hero_banners
  ADD COLUMN IF NOT EXISTS title_color text,
  ADD COLUMN IF NOT EXISTS subtitle_color text,
  ADD COLUMN IF NOT EXISTS title_size text,
  ADD COLUMN IF NOT EXISTS subtitle_size text,
  ADD COLUMN IF NOT EXISTS description_color text,
  ADD COLUMN IF NOT EXISTS description_size text,
  ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE public.promo_banners
  ADD COLUMN IF NOT EXISTS title_color text,
  ADD COLUMN IF NOT EXISTS description_color text,
  ADD COLUMN IF NOT EXISTS title_size text,
  ADD COLUMN IF NOT EXISTS description_size text;

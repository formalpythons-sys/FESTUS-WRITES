ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS has_video boolean DEFAULT false;

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS youtube_url text;

-- Newsletter Subscribers Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers' AND policyname = 'Anyone can insert their email') THEN
    CREATE POLICY "Anyone can insert their email" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'newsletter_subscribers' AND policyname = 'Newsletter subscribers are viewable by authenticated users only') THEN
    CREATE POLICY "Newsletter subscribers are viewable by authenticated users only" ON public.newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END$$;

-- Enable realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'newsletter_subscribers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscribers;
  END IF;
END$$;
-- ============================================================
-- NEWSLETTER SCHEMA FOR SUPABASE
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON newsletter_subscribers(is_active);

-- 2. Newsletter Campaigns Table (sent newsletters)
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  created_by TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Newsletter Tracking (opens/clicks per subscriber)
CREATE TABLE IF NOT EXISTS newsletter_tracking (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  campaign_id BIGINT REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id BIGINT REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  click_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Email Settings / Preferences
CREATE TABLE IF NOT EXISTS newsletter_preferences (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscriber_id BIGINT REFERENCES newsletter_subscribers(id) ON DELETE CASCADE UNIQUE,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'instant')),
  categories TEXT[] DEFAULT ARRAY['general', 'technology', 'sports', 'science', 'business', 'health'],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_preferences ENABLE ROW LEVEL SECURITY;

-- Policies: only service_role can access these tables
CREATE POLICY "Service role can do everything on subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on campaigns"
  ON newsletter_campaigns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on tracking"
  ON newsletter_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on preferences"
  ON newsletter_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
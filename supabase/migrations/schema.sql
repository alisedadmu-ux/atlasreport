-- ============================================================
-- COMPLETE ATLAS REPORT SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ARTICLES TABLE (dynamic news feed)
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT[] DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Atlas Report',
  category TEXT NOT NULL DEFAULT 'general',
  published TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles USING gin(to_tsvector('english', title));

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read articles"
  ON articles FOR SELECT TO public USING (true);

CREATE POLICY "Service role can manage articles"
  ON articles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. CONTACTS TABLE (contact form submissions)
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contacts"
  ON contacts FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Service role can read contacts"
  ON contacts FOR SELECT TO service_role USING (true);

-- 3. COMMUNITY POSTS (community comments/discussions)
CREATE TABLE IF NOT EXISTS community_posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  author_email TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes ON community_posts(like_count DESC);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read posts"
  ON community_posts FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert their own posts"
  ON community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE TO authenticated USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage posts"
  ON community_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. POST LIKES
CREATE TABLE IF NOT EXISTS post_likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON post_likes(user_id);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read likes"
  ON post_likes FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own likes"
  ON post_likes FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage likes"
  ON post_likes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. POST COMMENTS
CREATE TABLE IF NOT EXISTS post_comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  author_email TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_user ON post_comments(user_id);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read comments"
  ON post_comments FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert their own comments"
  ON post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own comments"
  ON post_comments FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage comments"
  ON post_comments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. FOLLOWS (user follows)
CREATE TABLE IF NOT EXISTS follows (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read follows"
  ON follows FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can follow"
  ON follows FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE TO authenticated USING (auth.uid()::text = follower_id);

CREATE POLICY "Service role can manage follows"
  ON follows FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. ARTICLE COMMENTS (news article comments)
CREATE TABLE IF NOT EXISTS comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT '',
  user_email TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read article comments"
  ON comments FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can comment on articles"
  ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own article comments"
  ON comments FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage comments"
  ON comments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 8. USER PROFILES (extended profile data)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_updated ON user_profiles(updated_at DESC);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read profiles"
  ON user_profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE TO authenticated USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage profiles"
  ON user_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- NEWSLETTER SCHEMA
-- ============================================================

-- 9. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage subscribers"
  ON newsletter_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 10. NEWSLETTER CAMPAIGNS
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created ON newsletter_campaigns(created_at DESC);

ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage campaigns"
  ON newsletter_campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 11. NEWSLETTER TRACKING
CREATE TABLE IF NOT EXISTS newsletter_tracking (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscriber_id BIGINT REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  campaign_id BIGINT NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  event TEXT NOT NULL DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_tracking_subscriber ON newsletter_tracking(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_tracking_campaign ON newsletter_tracking(campaign_id);

ALTER TABLE newsletter_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage tracking"
  ON newsletter_tracking FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 12. NEWSLETTER PREFERENCES
CREATE TABLE IF NOT EXISTS newsletter_preferences (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscriber_id BIGINT REFERENCES newsletter_subscribers(id) ON DELETE CASCADE UNIQUE,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'instant')),
  categories TEXT[] DEFAULT ARRAY['general', 'technology', 'sports', 'science', 'business', 'health'],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on preferences"
  ON newsletter_preferences FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET (for post images)
-- Note: Create this bucket via Supabase Dashboard → Storage
-- Name: post_images, Public: true, File size limit: 5MB
-- Or run this:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('post_images', 'post_images', true, 5242880, ARRAY['image/*'])
-- ON CONFLICT (id) DO NOTHING;
-- ============================================================

-- Storage policies (if bucket exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'post_images') THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    DO $policy1$
    BEGIN
      CREATE POLICY "Public can view post images"
        ON storage.objects FOR SELECT TO public USING (bucket_id = 'post_images');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $policy1$;

    DO $policy2$
    BEGIN
      CREATE POLICY "Authenticated users can upload post images"
        ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post_images');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $policy2$;

    DO $policy3$
    BEGIN
      CREATE POLICY "Users can update their own post images"
        ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'post_images' AND owner_id = auth.uid());
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $policy3$;

    DO $policy4$
    BEGIN
      CREATE POLICY "Users can delete their own post images"
        ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'post_images' AND owner_id = auth.uid());
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $policy4$;
  END IF;
END
$$;

-- Atlas Report Community Social Features Schema
-- Run this in your Supabase SQL Editor after the base schema

-- 1. Add image_url column to community_posts
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- 2. POST LIKES TABLE
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post likes are viewable by everyone" 
  ON public.post_likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can like posts" 
  ON public.post_likes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can unlike their own likes" 
  ON public.post_likes FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 3. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone" 
  ON public.follows FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can follow others" 
  ON public.follows FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can unfollow" 
  ON public.follows FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 4. POST COMMENTS TABLE (separate from article comments)
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  author_avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post comments are viewable by everyone" 
  ON public.post_comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can comment on posts" 
  ON public.post_comments FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own post comments" 
  ON public.post_comments FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 5. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User profiles are viewable by everyone" 
  ON public.user_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- 6. ENABLE REALTIME for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;

-- 7. Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage bucket policy (allow authenticated users to upload)
CREATE POLICY "Give users access to own folder"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'post_images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'post_images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Give public access to all images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post_images');

-- 9. Function to get like count for a post
CREATE OR REPLACE FUNCTION public.get_post_like_count(post_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM public.post_likes WHERE post_id = $1;
$$ LANGUAGE SQL STABLE;

-- 10. Function to get comment count for a post
CREATE OR REPLACE FUNCTION public.get_post_comment_count(post_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM public.post_comments WHERE post_id = $1;
$$ LANGUAGE SQL STABLE;

-- 11. Function to check if user liked a post
CREATE OR REPLACE FUNCTION public.user_liked_post(post_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.post_likes WHERE post_id = $1 AND user_id = $2);
$$ LANGUAGE SQL STABLE;

-- 12. Function to check if user follows another user
CREATE OR REPLACE FUNCTION public.user_follows_user(follower_id UUID, following_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.follows WHERE follower_id = $1 AND following_id = $2);
$$ LANGUAGE SQL STABLE;
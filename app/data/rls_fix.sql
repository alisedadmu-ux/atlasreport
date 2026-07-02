DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;

CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create community posts" 
  ON public.community_posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" 
  ON public.community_posts FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own posts" 
  ON public.community_posts FOR DELETE 
  USING (auth.role() = 'authenticated');
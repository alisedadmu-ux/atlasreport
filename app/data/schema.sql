-- Atlas Report Database Schema
-- Run this in your Supabase SQL Editor

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT[] DEFAULT '{}',
  image TEXT DEFAULT '',
  author TEXT DEFAULT 'Atlas Report Desk',
  published TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are viewable by everyone" 
  ON public.articles FOR SELECT 
  USING (true);

CREATE POLICY "Articles can be inserted by authenticated users only" 
  ON public.articles FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- 2. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  user_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 3. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  author_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts are viewable by everyone" 
  ON public.community_posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create community posts" 
  ON public.community_posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" 
  ON public.community_posts FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own posts" 
  ON public.community_posts FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 4. ENABLE REALTIME for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;

-- 5. SEED DATA: Insert sample articles
INSERT INTO public.articles (category, title, description, content, image, author) VALUES
-- General
('general', 'Global Summit Outlines Structural Architecture for Clean Energy Distribution Across Transit Corridors', 'International delegations assembled in Geneva to finalize the global standard framework targeting logistics grids, sustainable supply corridors, and clean manufacturing ecosystems.', ARRAY['International delegates gathered this week to finalize a historic agreement on clean energy infrastructure.', 'The framework targets a 40% reduction in transit emissions by 2030 through standardised logistics grids.', 'Key provisions include cross-border energy trading mechanisms and shared sustainability benchmarks.'], 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800', 'Reuters Desk'),
('general', 'Deep Maritime Exploration Teams Uncover Submerged Geothermal Vents Near Atlantic Ridge', 'Oceanographic researchers mapping deep abyssal zones confirm the location of previously undocumented active thermal networks hosting unique ecosystems.', ARRAY['A team of oceanographers has mapped a series of active geothermal vents along the Mid-Atlantic Ridge.', 'The vents support chemosynthetic ecosystems unlike anything seen in shallow waters.', 'Researchers deployed deep-sea submersibles equipped with high-resolution sonar to locate the sites.'], 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800', 'Associated Press'),
('general', 'Metropolitan Infrastructure Projects Test High-Capacity Smart Grids to Minimize Power Fluctuations', 'Urban planning committees deploy predictive power flow networks to dynamically balance grid load across massive residential districts.', ARRAY['Smart grid technology is being piloted across three major metropolitan regions.', 'The predictive networks use AI to balance load across residential and commercial districts.', 'Early results show a 15% reduction in power fluctuation events during peak hours.'], 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800', 'Global Bureau'),

-- Technology
('technology', 'Quantum Compute Clusters Demonstrate Quantum Superiority in Structural Engine Matrix Computations', 'Hardware developers achieve computational stability across custom silicon arrays, safely rendering sub-atomic simulation algorithms in record speed.', ARRAY['A major milestone in quantum computing was reached this week as researchers demonstrated stable operation across a 1000+ qubit array.', 'The system successfully rendered sub-atomic simulation algorithms in a fraction of the time required by classical supercomputers.', 'Industry analysts say this marks the transition from experimental to practical quantum systems.'], 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800', 'Tech Intelligence'),
('technology', 'Open-Source Database Maintainers Roll Out Cryptographic Architecture Patch to Prevent Grid Leaks', 'Security leads release localized updates securing multi-tenant ledger setups against distributed dictionary probing attempts.', ARRAY['A critical security patch has been rolled out across major open-source database systems.', 'The update addresses vulnerabilities exposed by distributed dictionary probing attacks.', 'System administrators are urged to apply the patch immediately to prevent data leaks.'], 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800', 'Cyber Review'),

-- Sports
('sports', 'International Racing Circuits Redesign High-Velocity Curves Following Advanced Computational Modeling', 'Aerodynamic engineers adjust mechanical asphalt compositions and barrier angles to balance vehicle safety with high-speed competitive friction.', ARRAY['Advanced computational fluid dynamics modelling has led to the redesign of several high-speed corners.', 'New asphalt compositions provide improved grip while maintaining optimal tire wear.', 'Safety barrier angles have been optimised to reduce impact forces during incidents.'], 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800', 'Circuit Desk'),
('sports', 'Global Football Analytics Agency Tracks Real-Time Spatial Tracking Patterns in Championship Matchups', 'Wearable sensor metrics gather precise telemetry data measuring mechanical velocity and acceleration curves of prime championship athletes.', ARRAY['Wearable sensors are now providing real-time spatial tracking data during championship matches.', 'Analytics teams can measure acceleration, deceleration, and positional efficiency.', 'This data is transforming how coaches approach game strategy and player fitness management.'], 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800', 'Athletic Metrics'),

-- Science
('science', 'Orbital Observatories Transmit Deep-Field Core Visuals Detailing Stellar Nurseries Near Perseus Arm', 'Spectroscopic instrumentation parses heavy infrared layers to locate early protostar gas configurations moving within high-density cosmic waves.', ARRAY['The James Webb Space Telescope has captured unprecedented images of stellar nurseries in the Perseus Arm.', 'Spectroscopic analysis reveals early-stage protostar formations within dense gas clouds.', 'These observations will help astronomers understand the early stages of star formation.'], 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800', 'Astro Review'),
('science', 'Synthetic Biologists Successfully Construct Enzymes Capable of Breaking Down Rigid Industrial Composites', 'Laboratory groups isolate a stable protein alignment that isolates and metabolizes high-density polymer compounds in room temperature environments.', ARRAY['A breakthrough in synthetic biology has produced enzymes capable of breaking down industrial polymers.', 'The enzymes operate at room temperature and neutral pH, making them suitable for large-scale applications.', 'This development could revolutionise recycling and waste management industries.'], 'https://images.unsplash.com/photo-1532187863486-abf9d39d6618?q=80&w=800', 'Science Daily'),

-- Business
('business', 'Logistics Software Mergers Re-Index Standard Cargo Delivery Values Across Northern Channels', 'Enterprise integration platforms combine operations, standardizing automated maritime manifest validation across major deepwater shipping ports.', ARRAY['A wave of consolidation is reshaping the logistics software industry.', 'Merged platforms are standardising maritime manifest validation across major ports.', 'This integration is expected to reduce shipping delays by up to 20%.'], 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800', 'Financial Press'),

-- Health
('health', 'High-Resolution Protein Structure Mapping Pinpoints Vulnerable Entry Mechanisms in Viral Coats', 'Microscopic scanning arrays help research networks trace the spatial geometry of outer membrane tags to plan tailored preventive blocking techniques.', ARRAY['Cryo-electron microscopy has enabled researchers to map viral surface proteins at atomic resolution.', 'The detailed structures reveal vulnerable entry points that could be targeted by new therapeutics.', 'This approach promises faster development of antiviral treatments and vaccines.'], 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800', 'Medical Network');
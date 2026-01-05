-- =============================================
-- GAMIFICATION SYSTEM FOR RETRO ARCHIVE
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. INTERACTIONS TABLE (Reactions)
-- Tracks individual clicks on reaction buttons
CREATE TABLE IF NOT EXISTS interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transformation_id TEXT NOT NULL, -- Connects to transformations table (but no strict FK to allow JSON flexibility if needed, or enforce it)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for anon users
    session_id TEXT, -- Fingerprint for anon users (optional)
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'fire', 'mindblown', 'diamond')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast counting
CREATE INDEX IF NOT EXISTS idx_interactions_trans_type ON interactions(transformation_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at);

-- 2. CATEGORY VOTES TABLE
-- Tracks detailed 1-5 (or 1-10) scoring per category
CREATE TABLE IF NOT EXISTS category_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transformation_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    category TEXT NOT NULL CHECK (category IN ('realism', 'impact', 'fidelity')),
    vote_value INTEGER NOT NULL CHECK (vote_value >= 1 AND vote_value <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for averaging
CREATE INDEX IF NOT EXISTS idx_cat_votes_trans_cat ON category_votes(transformation_id, category);


-- 3. RANKING SCORES VIEW
-- aggregation for leaderboards
-- Weights: Like=1, Fire=2, Mindblown=3, Diamond=5
CREATE OR REPLACE VIEW ranking_scores_view AS
SELECT 
    transformation_id,
    COUNT(*) FILTER (WHERE interaction_type = 'like') as like_count,
    COUNT(*) FILTER (WHERE interaction_type = 'fire') as fire_count,
    COUNT(*) FILTER (WHERE interaction_type = 'mindblown') as mindblown_count,
    COUNT(*) FILTER (WHERE interaction_type = 'diamond') as diamond_count,
    (
        (COUNT(*) FILTER (WHERE interaction_type = 'like') * 1) +
        (COUNT(*) FILTER (WHERE interaction_type = 'fire') * 2) +
        (COUNT(*) FILTER (WHERE interaction_type = 'mindblown') * 3) +
        (COUNT(*) FILTER (WHERE interaction_type = 'diamond') * 5)
    ) as total_score
FROM interactions
GROUP BY transformation_id;

-- 4. MATERIALIZED VIEW FOR WEEKLY RANKINGS (Performance)
-- Useful if table gets huge. For now, standard view is fine.
-- Example query for weekly: WHERE created_at > now() - interval '7 days'

-- 5. RLS POLICIES
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_votes ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read interactions" ON interactions FOR SELECT USING (true);
CREATE POLICY "Public read category_votes" ON category_votes FOR SELECT USING (true);

-- Allow public insert (Anon allowed)
CREATE POLICY "Public insert interactions" ON interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert category_votes" ON category_votes FOR INSERT WITH CHECK (true);

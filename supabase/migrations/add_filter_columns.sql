-- Run this script in your Supabase SQL Editor to add the new filter columns

ALTER TABLE transformations 
ADD COLUMN IF NOT EXISTS era text,
ADD COLUMN IF NOT EXISTS style text,
ADD COLUMN IF NOT EXISTS realism_level text;

-- Add comments for clarity
COMMENT ON COLUMN transformations.era IS 'Time period of the anime (e.g., 80s, 90s, 00s, Modern)';
COMMENT ON COLUMN transformations.style IS 'Visual style (e.g., Cyberpunk, Dark Fantasy, Urban, Sengoku)';
COMMENT ON COLUMN transformations.realism_level IS 'Level of realism (e.g., Photorealistic, Cinematic 2.5D, Stylized Realism)';

-- (Optional) If you want to enforce specific values, you can add check constraints:
-- ALTER TABLE transformations ADD CONSTRAINT check_era CHECK (era IN ('80s', '90s', '00s', 'Modern'));
-- keeping it flexible as TEXT for now.

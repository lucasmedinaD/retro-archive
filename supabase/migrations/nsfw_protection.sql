-- Add NSFW flag to transformations table
ALTER TABLE transformations 
ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT false;

-- Add NSFW preference to profiles table
-- Note: Check if profiles table exists first. If using strict Supabase Auth, 
-- user preferences might need to be stored in a 'profiles' or 'users_public' table.
-- Assuming 'profiles' exists based on standard patterns or we create it.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  show_nsfw BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already existed, just add the column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'show_nsfw') THEN
        ALTER TABLE profiles ADD COLUMN show_nsfw BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Enable RLS on profiles if new
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Insert profile on signup (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, show_nsfw)
  VALUES (new.id, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

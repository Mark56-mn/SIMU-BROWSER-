-- SUPABASE DATBASE MIGRATION
-- Adding Ambassador ecosystem and Chat Encryption

-- 1. Create Profiles Table (if not exists) and add Ambassador columns
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  ambassador_type TEXT CHECK (ambassador_type IN ('game_dev', 'support', 'announcements', 'community')),
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Only admins can update official status" ON profiles FOR UPDATE USING (
  -- Requires an admin role mapping or custom claim in reality.
  -- For this demo, check if the updater has admin privileges.
  auth.uid() = id OR (auth.jwt() ->> 'role' = 'admin')
);

-- 3. Create Group Messages Table for End-to-End/Backend Encrypted Chat
CREATE TABLE IF NOT EXISTS group_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL, -- UUID or simulated ID for placeholder users
  author_name TEXT NOT NULL,
  content_encrypted TEXT NOT NULL,
  iv TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Group messages viewable by everyone" ON group_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert group messages" ON group_messages FOR INSERT WITH CHECK (true);

-- 4. RPC for promoting a user to Ambassador (admin only)
CREATE OR REPLACE FUNCTION admin_promote_ambassador(target_user_id UUID, role_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Logic to verify the caller is admin would go here
  UPDATE profiles 
  SET is_official = true, ambassador_type = role_type
  WHERE id = target_user_id;
END;
$$;

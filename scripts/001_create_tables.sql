-- Holocaust Memorial Database Schema

-- History content table (stores the main history text and highlighted words)
CREATE TABLE IF NOT EXISTS history_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  highlighted_words JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters table (stores person information for the wall)
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  external_link TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  rotation INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE history_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can view)
CREATE POLICY "Allow public read access on history_content" 
  ON history_content FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on characters" 
  ON characters FOR SELECT 
  USING (true);

-- Admin write policies (authenticated users can modify)
CREATE POLICY "Allow authenticated users to insert history_content" 
  ON history_content FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update history_content" 
  ON history_content FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete history_content" 
  ON history_content FOR DELETE 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert characters" 
  ON characters FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update characters" 
  ON characters FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete characters" 
  ON characters FOR DELETE 
  TO authenticated
  USING (true);

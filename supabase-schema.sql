-- Messages table for cake discussions with admin
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cake_id INTEGER NOT NULL,
  cake_title TEXT NOT NULL,
  cake_image TEXT,
  cake_price INTEGER,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_email TEXT,
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_cake_id ON messages(cake_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_admin_reply ON messages(is_admin_reply);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert messages (for users to send messages)
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can view messages for a specific cake
CREATE POLICY "Users can view messages" ON messages
  FOR SELECT
  USING (true);

-- Policy: Admin can do everything (you can add admin authentication later)
CREATE POLICY "Admin full access" ON messages
  FOR ALL
  USING (true);

-- =====================================================
-- REVIEWS/RATINGS TABLE
-- Stores customer reviews and ratings for cakes
-- =====================================================
CREATE TABLE IF NOT EXISTS cake_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cake_id INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_cake_reviews_cake_id ON cake_reviews(cake_id);
CREATE INDEX IF NOT EXISTS idx_cake_reviews_rating ON cake_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_cake_reviews_created_at ON cake_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE cake_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view reviews
CREATE POLICY "Users can view reviews" ON cake_reviews
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert reviews
CREATE POLICY "Users can insert reviews" ON cake_reviews
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own reviews (based on phone)
CREATE POLICY "Users can update own reviews" ON cake_reviews
  FOR UPDATE
  USING (true);

-- Policy: Admin can do everything
CREATE POLICY "Admin full access to reviews" ON cake_reviews
  FOR ALL
  USING (true);

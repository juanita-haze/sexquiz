-- Supabase Database Schema for ThatSexQuiz
-- Run this in your Supabase SQL Editor

-- Drop existing table if you want to start fresh (uncomment if needed)
-- DROP TABLE IF EXISTS quiz_sessions;
-- DROP TABLE IF EXISTS referral_codes;

-- =====================================================
-- REFERRAL CODES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,              -- Unique referral code (e.g., "INFLUENCER10")
  influencer_name TEXT NOT NULL,          -- Name of the influencer/source
  discount_percent INTEGER DEFAULT 0,     -- Discount percentage (0-100)
  is_active BOOLEAN DEFAULT TRUE,         -- Whether the code is active
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for code lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active);

-- Row Level Security for referral_codes
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active referral codes (for validation)
CREATE POLICY "Allow anonymous read referral codes" ON referral_codes
  FOR SELECT USING (true);

-- Only service role can insert/update/delete (admin operations)
CREATE POLICY "Allow service role full access" ON referral_codes
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- QUIZ SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Partner A (the one who starts the quiz)
  partner_a_name TEXT,
  partner_a_anatomy TEXT, -- 'male' or 'female'
  partner_a_answers JSONB,
  -- Partner B (the one who receives the link)
  partner_b_name TEXT,
  partner_b_anatomy TEXT, -- 'male' or 'female'
  partner_b_answers JSONB,
  -- Payment
  paid BOOLEAN DEFAULT FALSE,
  stripe_session_id TEXT,
  amount_paid INTEGER DEFAULT 0,          -- Amount paid in cents
  -- Referral tracking
  referral_code TEXT,                     -- The referral code used (if any)
  discount_applied INTEGER DEFAULT 0,     -- Discount applied in cents
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns if table already exists (run these if upgrading)
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS partner_a_anatomy TEXT;
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS partner_b_anatomy TEXT;
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS referral_code TEXT;
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS discount_applied INTEGER DEFAULT 0;
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_paid ON quiz_sessions(paid);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_referral_code ON quiz_sessions(referral_code);

-- Row Level Security (RLS)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read and insert
CREATE POLICY "Allow anonymous read" ON quiz_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON quiz_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON quiz_sessions
  FOR UPDATE USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to clean up old quiz sessions (90 days)
CREATE OR REPLACE FUNCTION cleanup_old_quiz_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM quiz_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Function to get referral statistics
CREATE OR REPLACE FUNCTION get_referral_stats()
RETURNS TABLE (
  code TEXT,
  influencer_name TEXT,
  discount_percent INTEGER,
  is_active BOOLEAN,
  total_uses BIGINT,
  total_revenue BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rc.code,
    rc.influencer_name,
    rc.discount_percent,
    rc.is_active,
    COUNT(qs.id) as total_uses,
    COALESCE(SUM(qs.amount_paid), 0) as total_revenue,
    rc.created_at
  FROM referral_codes rc
  LEFT JOIN quiz_sessions qs ON qs.referral_code = rc.code AND qs.paid = true
  GROUP BY rc.id, rc.code, rc.influencer_name, rc.discount_percent, rc.is_active, rc.created_at
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

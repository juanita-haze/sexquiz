-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  influencer_name TEXT NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to quiz_sessions
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS discount_applied INTEGER DEFAULT 0;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_referral_code ON quiz_sessions(referral_code);

-- Enable RLS on referral_codes
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to referral_codes
CREATE POLICY "Service role can manage referral_codes" ON referral_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);

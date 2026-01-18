-- Supabase Database Schema for ThatSexQuiz
-- Run this in your Supabase SQL Editor

-- Drop existing table if you want to start fresh (uncomment if needed)
-- DROP TABLE IF EXISTS quiz_sessions;

-- Create the quiz_sessions table
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
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns if table already exists (run these if upgrading)
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS partner_a_anatomy TEXT;
-- ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS partner_b_anatomy TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_paid ON quiz_sessions(paid);

-- Row Level Security (RLS)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read and insert
CREATE POLICY "Allow anonymous read" ON quiz_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON quiz_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON quiz_sessions
  FOR UPDATE USING (true);

-- Function to clean up old quiz sessions (90 days)
CREATE OR REPLACE FUNCTION cleanup_old_quiz_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM quiz_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

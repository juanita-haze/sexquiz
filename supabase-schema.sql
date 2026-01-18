-- Supabase Database Schema for Couple Quiz
-- Run this in your Supabase SQL Editor

-- Create the quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_a_name TEXT,
  partner_b_name TEXT,
  partner_a_answers JSONB,
  partner_b_answers JSONB,
  paid BOOLEAN DEFAULT FALSE,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_paid ON quiz_sessions(paid);

-- Row Level Security (RLS)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read and insert
-- (In production, you might want to restrict this further)
CREATE POLICY "Allow anonymous read" ON quiz_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert" ON quiz_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON quiz_sessions
  FOR UPDATE USING (true);

-- Optional: Create a function to clean up old quiz sessions (90 days)
CREATE OR REPLACE FUNCTION cleanup_old_quiz_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM quiz_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup daily
-- Note: This requires pg_cron extension enabled in Supabase
-- SELECT cron.schedule('cleanup-old-quizzes', '0 0 * * *', 'SELECT cleanup_old_quiz_sessions()');

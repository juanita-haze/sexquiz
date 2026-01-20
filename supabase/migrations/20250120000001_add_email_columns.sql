-- Add email columns to quiz_sessions table
ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS partner_a_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_b_email VARCHAR(255);

-- Create index for email lookups (useful for future email notifications)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_partner_a_email ON quiz_sessions(partner_a_email) WHERE partner_a_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_partner_b_email ON quiz_sessions(partner_b_email) WHERE partner_b_email IS NOT NULL;

-- Comment on columns
COMMENT ON COLUMN quiz_sessions.partner_a_email IS 'Email address of partner A for notifications';
COMMENT ON COLUMN quiz_sessions.partner_b_email IS 'Email address of partner B for notifications';

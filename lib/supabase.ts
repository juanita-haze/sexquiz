import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key for admin operations
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}

// Types for our database
export interface QuizSession {
  id: string;
  partner_a_name: string | null;
  partner_b_name: string | null;
  partner_a_answers: Record<string, number> | null;
  partner_b_answers: Record<string, number> | null;
  paid: boolean;
  stripe_session_id: string | null;
  created_at: string;
}

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
export type Anatomy = 'male' | 'female';

export interface QuizSession {
  id: string;
  partner_a_name: string | null;
  partner_a_anatomy: Anatomy | null;
  partner_a_answers: Record<string, number> | null;
  partner_b_name: string | null;
  partner_b_anatomy: Anatomy | null;
  partner_b_answers: Record<string, number> | null;
  paid: boolean;
  stripe_session_id: string | null;
  amount_paid: number;
  referral_code: string | null;
  discount_applied: number;
  created_at: string;
}

export interface ReferralCode {
  id: string;
  code: string;
  influencer_name: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReferralStats {
  code: string;
  influencer_name: string;
  discount_percent: number;
  is_active: boolean;
  total_uses: number;
  total_revenue: number;
  created_at: string;
}

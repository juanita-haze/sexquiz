import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Find the referral code (case-insensitive)
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select('*')
      .ilike('code', code)
      .eq('is_active', true)
      .single();

    if (error || !referralCode) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or inactive referral code'
      });
    }

    return NextResponse.json({
      valid: true,
      code: referralCode.code,
      influencer_name: referralCode.influencer_name,
      discount_percent: referralCode.discount_percent,
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    return NextResponse.json({ error: 'Error validating code' }, { status: 500 });
  }
}

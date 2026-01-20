import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { PRICE_AMOUNT } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, referralCode } = body;

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });
    }

    // Verify the quiz exists and both partners have completed
    const supabase = createServerClient();
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (!session.partner_a_answers || !session.partner_b_answers) {
      return NextResponse.json(
        { error: 'Both partners must complete the quiz first' },
        { status: 400 }
      );
    }

    if (session.paid) {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 });
    }

    // Calculate final price with discount
    let finalAmount = PRICE_AMOUNT; // $4.95 in cents = 495
    let discountApplied = 0;
    let validReferralCode: string | null = null;

    // Validate referral code if provided
    if (referralCode) {
      const { data: referral } = await supabase
        .from('referral_codes')
        .select('*')
        .ilike('code', referralCode)
        .eq('is_active', true)
        .single();

      if (referral) {
        validReferralCode = referral.code;
        if (referral.discount_percent > 0) {
          discountApplied = Math.round(PRICE_AMOUNT * (referral.discount_percent / 100));
          finalAmount = PRICE_AMOUNT - discountApplied;
        }
      }
    }

    // TEMPORARY: Skip Stripe and mark as paid directly for testing
    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update({
        paid: true,
        amount_paid: finalAmount,
        referral_code: validReferralCode,
        discount_applied: discountApplied,
      })
      .eq('id', quizId);

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
    }

    // Redirect back to results with success
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.json({ url: `${baseUrl}/results/${quizId}?success=true` });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error creating checkout' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId } = body;

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

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession(quizId);

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error creating checkout' }, { status: 500 });
  }
}

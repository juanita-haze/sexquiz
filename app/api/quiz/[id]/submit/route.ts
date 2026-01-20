import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const body = await request.json();
    const { partner, answers, email } = body;

    if (!quizId || !answers || typeof answers !== 'object' || !partner) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const isPartnerB = partner === 'B';

    const supabase = createServerClient();

    // Fetch the current session
    const { data: session, error: fetchError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', quizId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (isPartnerB) {
      // Partner B submitting
      if (!session.partner_a_answers) {
        return NextResponse.json(
          { error: 'Partner A has not completed yet' },
          { status: 400 }
        );
      }

      if (session.partner_b_answers) {
        return NextResponse.json(
          { error: 'Partner B has already submitted' },
          { status: 400 }
        );
      }

      updateData.partner_b_answers = answers;
      if (email && typeof email === 'string' && email.includes('@')) {
        updateData.partner_b_email = email.trim().toLowerCase();
      }
    } else {
      // Partner A submitting
      if (session.partner_a_answers) {
        return NextResponse.json(
          { error: 'Partner A has already submitted' },
          { status: 400 }
        );
      }

      updateData.partner_a_answers = answers;
      if (email && typeof email === 'string' && email.includes('@')) {
        updateData.partner_a_email = email.trim().toLowerCase();
      }
    }

    // Update the session
    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', quizId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Error saving answers' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

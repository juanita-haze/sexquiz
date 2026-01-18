import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers, isPartnerB, partnerBName } = body;

    if (!quizId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

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
        return NextResponse.json({ error: 'Partner A has not completed yet' }, { status: 400 });
      }

      if (session.partner_b_answers) {
        return NextResponse.json({ error: 'Partner B has already submitted' }, { status: 400 });
      }

      updateData.partner_b_answers = answers;
      if (partnerBName) {
        updateData.partner_b_name = partnerBName.trim().substring(0, 50);
      }
    } else {
      // Partner A submitting
      if (session.partner_a_answers) {
        return NextResponse.json({ error: 'Partner A has already submitted' }, { status: 400 });
      }

      updateData.partner_a_answers = answers;
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

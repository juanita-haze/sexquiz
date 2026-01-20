import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET - Fetch quiz session by ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });
  }

  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new quiz session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partner_a_name, partner_a_anatomy, partner_b_name, partner_b_anatomy } = body;

    // Validate input
    if (!partner_a_name || !partner_b_name) {
      return NextResponse.json({ error: 'Both names are required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        partner_a_name: partner_a_name.trim().substring(0, 50),
        partner_a_anatomy: partner_a_anatomy || 'female',
        partner_b_name: partner_b_name.trim().substring(0, 50),
        partner_b_anatomy: partner_b_anatomy || 'male',
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Error creating quiz' }, { status: 500 });
    }

    if (!data.id) {
      console.error('Quiz created but no ID returned:', data);
      return NextResponse.json({ error: 'Error creating quiz' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

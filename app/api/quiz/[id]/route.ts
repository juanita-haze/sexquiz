import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET - Fetch quiz session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('Fetching quiz with ID:', id);

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });
    }

    const supabase = createServerClient();

    console.log('Supabase client created, querying quiz_sessions...');

    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ 
        error: 'Quiz not found',
        details: error.message 
      }, { status: 404 });
    }

    if (!data) {
      console.error('No data returned from Supabase');
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    console.log('Quiz found:', data.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

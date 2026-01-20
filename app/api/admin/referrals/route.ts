import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Simple admin password protection (in production, use proper auth)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// GET - List all referral codes with stats
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    // Get all referral codes
    const { data: codes, error: codesError } = await supabase
      .from('referral_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (codesError) {
      throw codesError;
    }

    // Get usage stats for each code
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('referral_code, amount_paid, paid')
      .not('referral_code', 'is', null);

    if (sessionsError) {
      throw sessionsError;
    }

    // Calculate stats for each code
    const stats = codes?.map(code => {
      const codeSessions = sessions?.filter(s =>
        s.referral_code?.toLowerCase() === code.code.toLowerCase()
      ) || [];

      const paidSessions = codeSessions.filter(s => s.paid);

      return {
        ...code,
        total_uses: codeSessions.length,
        total_paid: paidSessions.length,
        total_revenue: paidSessions.reduce((sum, s) => sum + (s.amount_paid || 0), 0),
      };
    });

    return NextResponse.json({ referrals: stats });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Error fetching referrals' }, { status: 500 });
  }
}

// POST - Create new referral code
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, influencer_name, discount_percent } = body;

    if (!code || !influencer_name) {
      return NextResponse.json(
        { error: 'Code and influencer name are required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if code already exists
    const { data: existing } = await supabase
      .from('referral_codes')
      .select('id')
      .ilike('code', code)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A code with this name already exists' },
        { status: 400 }
      );
    }

    // Create the referral code
    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        code: code.toUpperCase(),
        influencer_name,
        discount_percent: discount_percent || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ referral: data });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json({ error: 'Error creating referral' }, { status: 500 });
  }
}

// PUT - Update referral code
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, code, influencer_name, discount_percent, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (code !== undefined) updateData.code = code.toUpperCase();
    if (influencer_name !== undefined) updateData.influencer_name = influencer_name;
    if (discount_percent !== undefined) updateData.discount_percent = discount_percent;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('referral_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ referral: data });
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json({ error: 'Error updating referral' }, { status: 500 });
  }
}

// DELETE - Delete referral code
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from('referral_codes')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting referral:', error);
    return NextResponse.json({ error: 'Error deleting referral' }, { status: 500 });
  }
}

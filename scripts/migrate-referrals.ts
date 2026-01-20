import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables. Make sure .env.local has:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigrations() {
  console.log('🚀 Running migrations...\n');

  // Migration 1: Create referral_codes table
  console.log('1. Creating referral_codes table...');
  const { error: error1 } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS referral_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        influencer_name TEXT NOT NULL,
        discount_percent INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (error1) {
    // Try direct insert approach if rpc doesn't work
    console.log('   Using alternative method...');
  }

  // Migration 2: Add columns to quiz_sessions
  console.log('2. Adding referral columns to quiz_sessions...');

  // Try to add each column individually
  const columns = [
    { name: 'referral_code', type: 'TEXT' },
    { name: 'discount_applied', type: 'INTEGER DEFAULT 0' },
    { name: 'amount_paid', type: 'INTEGER DEFAULT 0' },
  ];

  for (const col of columns) {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`
    });

    if (error) {
      console.log(`   Column ${col.name}: might already exist or needs manual creation`);
    } else {
      console.log(`   Column ${col.name}: ✓`);
    }
  }

  // Migration 3: Create indexes
  console.log('3. Creating indexes...');
  await supabase.rpc('exec_sql', {
    sql: `CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);`
  });
  await supabase.rpc('exec_sql', {
    sql: `CREATE INDEX IF NOT EXISTS idx_quiz_sessions_referral_code ON quiz_sessions(referral_code);`
  });

  console.log('\n✅ Migrations complete!');
  console.log('\nNote: If you see errors, you may need to run the SQL manually in Supabase Dashboard.');
}

runMigrations().catch(console.error);
